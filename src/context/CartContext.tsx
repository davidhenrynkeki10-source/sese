"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { Product, Order } from "@/data/inventory";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
  selectedSize?: string;
  stock?: number;
}

export interface PaymentInitResponse {
  success: boolean;
  orderId: string;
  reference: string;
  accessCode?: string;
  authorizationUrl?: string;
  amount: number;
  currency: string;
  gateway: "paystack" | "stripe";
  publicKey: string;
  testMode?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Product | { id: string; slug: string; name: string; price: number; image?: string; category?: string; stock?: number }, qty?: number, size?: string) => void;
  removeFromCart: (id: string, selectedSize?: string) => void;
  updateQty: (id: string, qty: number, selectedSize?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickBuyProduct: Product | null;
  openQuickBuy: (product: Product) => void;
  closeQuickBuy: () => void;
  // Checkout flow
  isCheckingOut: boolean;
  checkoutError: string | null;
  paymentInitData: PaymentInitResponse | null;
  isPaymentModalOpen: boolean;
  closePaymentModal: () => void;
  completedOrder: Order | null;
  closeCompletedOrder: () => void;
  executeCheckout: (email: string, name?: string, gateway?: "paystack" | "stripe") => Promise<PaymentInitResponse | null>;
  verifyAndFinalizePayment: (reference: string, gateway?: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "sese-cart-v2";
const LEGACY_STORAGE_KEY = "sese-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentInitData, setPaymentInitData] = useState<PaymentInitResponse | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Save cart to localStorage and maintain legacy compatibility
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      // Sync legacy slug array for older components
      const slugs = cart.flatMap((item) => Array(item.qty).fill(item.slug));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(slugs));
      window.dispatchEvent(new Event("sese:cart"));
    } catch (e) {
      console.warn("Failed to save cart to localStorage:", e);
    }
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const addToCart = useCallback(
    (
      product: Product | { id: string; slug: string; name: string; price: number; image?: string; category?: string; stock?: number },
      qty = 1,
      size?: string
    ) => {
      setCart((prev) => {
        const itemSize = size || ("sizes" in product && product.sizes ? product.sizes[0] : "Standard");
        const existingIdx = prev.findIndex(
          (item) => item.id === product.id && item.selectedSize === itemSize
        );

        if (existingIdx > -1) {
          const updated = [...prev];
          const newQty = updated[existingIdx].qty + qty;
          const maxStock = product.stock ?? 999;
          updated[existingIdx] = {
            ...updated[existingIdx],
            qty: Math.min(newQty, maxStock),
          };
          return updated;
        }

        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image || "/images/man-bag.png",
            category: product.category || "Retail",
            qty,
            selectedSize: itemSize,
            stock: product.stock,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (item.id !== id) return true;
        if (selectedSize && item.selectedSize !== selectedSize) return true;
        return false;
      })
    );
  }, []);

  const updateQty = useCallback((id: string, qty: number, selectedSize?: string) => {
    if (qty <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && (!selectedSize || item.selectedSize === selectedSize)) {
          const max = item.stock ?? 999;
          return { ...item, qty: Math.min(qty, max) };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      window.dispatchEvent(new Event("sese:cart"));
    } catch {
      // ignore
    }
  }, []);

  const openQuickBuy = useCallback((product: Product) => {
    setQuickBuyProduct(product);
  }, []);

  const closeQuickBuy = useCallback(() => {
    setQuickBuyProduct(null);
  }, []);

  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
  }, []);

  const closeCompletedOrder = useCallback(() => {
    setCompletedOrder(null);
  }, []);

  // Workflow step 2 & 3:
  // Client: User clicks "Pay Now" -> Send cart [{id, qty}] to Node backend.
  // Server: Validate stock & recalculate official total.
  // Server: Request payment initialization -> Return a transaction reference or access code.
  const executeCheckout = useCallback(
    async (email: string, name?: string, gateway: "paystack" | "stripe" = "paystack"): Promise<PaymentInitResponse | null> => {
      setIsCheckingOut(true);
      setCheckoutError(null);

      try {
        const payload = {
          cart: cart.map((i) => ({
            id: i.id,
            qty: i.qty,
            selectedSize: i.selectedSize,
          })),
          email,
          name,
          gateway,
        };

        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Checkout initialization failed. Please check stock.");
        }

        const initResponse: PaymentInitResponse = {
          success: true,
          orderId: data.orderId,
          reference: data.reference,
          accessCode: data.accessCode,
          authorizationUrl: data.authorizationUrl,
          amount: data.amount,
          currency: data.currency,
          gateway: data.gateway,
          publicKey: data.publicKey,
          testMode: data.testMode,
        };

        setPaymentInitData(initResponse);
        setIsPaymentModalOpen(true);
        return initResponse;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unable to initiate payment.";
        setCheckoutError(message);
        return null;
      } finally {
        setIsCheckingOut(false);
      }
    },
    [cart]
  );

  // Workflow step 5:
  // Server: Verify the payment via direct API call before marking the order as paid.
  const verifyAndFinalizePayment = useCallback(
    async (reference: string, gateway = "paystack"): Promise<boolean> => {
      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference, gateway }),
        });

        const data = await res.json();

        if (res.ok && data.success && data.order) {
          clearCart();
          setIsPaymentModalOpen(false);
          setIsCartOpen(false);
          setQuickBuyProduct(null);
          setCompletedOrder(data.order);
          return true;
        } else {
          setCheckoutError(data.error || "Payment verification could not be confirmed.");
          return false;
        }
      } catch (err) {
        console.error("Verification error:", err);
        setCheckoutError("Payment verification failed due to network connection.");
        return false;
      }
    },
    [clearCart]
  );

  const value = {
    cart,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    quickBuyProduct,
    openQuickBuy,
    closeQuickBuy,
    isCheckingOut,
    checkoutError,
    paymentInitData,
    isPaymentModalOpen,
    closePaymentModal,
    completedOrder,
    closeCompletedOrder,
    executeCheckout,
    verifyAndFinalizePayment,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
