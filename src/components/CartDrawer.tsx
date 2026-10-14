"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/collections";
import { showProductAddedAlert, showQuantityUpdatedAlert } from "@/utils/alerts";
import RollingNumber from "./RollingNumber";

export default function CartDrawer() {
  const {
    cart,
    totalItems,
    subtotal,
    removeFromCart,
    updateQty,
    isCartOpen,
    setIsCartOpen,
    executeCheckout,
    isCheckingOut,
    checkoutError,
  } = useCart();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gateway, setGateway] = useState<"paystack" | "stripe">("paystack");
  const [formError, setFormError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid email address for receipt and payment reference.");
      return;
    }

    if (cart.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    // Workflow step: Client: User clicks "Pay Now" -> Send cart [{id, qty}] to Node backend
    await executeCheckout(email.trim(), name.trim(), gateway);
  };

  return (
    <div
      className="cart-drawer-overlay"
      onClick={() => setIsCartOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1100,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch",
        animation: "cartFadeIn 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes cartFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cartSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-slide-panel {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background: #ffffff;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          animation: cartSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          font-family: var(--ui-sans, Arial, sans-serif);
        }
        @media (max-width: 600px) {
          .cart-slide-panel {
            max-width: 100% !important;
          }
        }
        .cart-pay-btn {
          background: #262320;
          color: #ffffff;
          border: 1px solid #262320;
          padding: 16px 20px;
          font-size: 10.5px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .cart-pay-btn:hover:not(:disabled) {
          background: #000000;
          transform: translateY(-1px);
        }
        .cart-pay-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cart-input {
          width: 100%;
          border: 1px solid #d7d0c5;
          padding: 10px 12px;
          font-size: 12px;
          background: #ffffff;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
        }
        .cart-input:focus {
          border-color: #262320;
        }
        .gateway-pill {
          flex: 1;
          padding: 8px 10px;
          border: 1px solid #d7d0c5;
          background: #ffffff;
          font-size: 10px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }
        .gateway-pill.selected {
          border-color: #262320;
          background: #262320;
          color: #ffffff;
        }
      `}</style>

      <div
        className="cart-slide-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 28px 18px",
            borderBottom: "1px solid #f0ece5",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "#8a837a",
                fontWeight: 500,
              }}
            >
              Your Selection
            </span>
            <h2
              style={{
                fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
                fontSize: "24px",
                color: "#262320",
                margin: "4px 0 0",
                fontWeight: 400,
              }}
            >
              Cart ({totalItems})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            style={{
              fontSize: "10.5px",
              letterSpacing: "1px",
              color: "#8a837a",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            [Close &times;]
          </button>
        </div>

        {/* Content list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p
                style={{
                  fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
                  fontSize: "20px",
                  color: "#756e65",
                  marginBottom: "16px",
                }}
              >
                Your cart is currently empty.
              </p>
              <Link
                href="/store/retail"
                onClick={() => setIsCartOpen(false)}
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#262320",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                Explore Retail Pieces &rarr;
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {cart.map((item, idx) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${idx}`}
                  style={{
                    display: "flex",
                    gap: "16px",
                    paddingBottom: "18px",
                    borderBottom: "1px solid #f0ece5",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "74px",
                      height: "96px",
                      backgroundColor: "#f7f5f0",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="74px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.8px",
                          textTransform: "uppercase",
                          color: "#8a837a",
                        }}
                      >
                        {item.category}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#262320",
                          margin: "2px 0 4px",
                        }}
                      >
                        {item.name}
                      </div>
                      {item.selectedSize && (
                        <div style={{ fontSize: "10.5px", color: "#756e65" }}>
                          Size: <span style={{ color: "#262320", fontWeight: 500 }}>{item.selectedSize}</span>
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#262320",
                          marginTop: "4px",
                        }}
                      >
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls & Remove */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid #d7d0c5",
                          background: "#ffffff",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            updateQty(item.id, item.qty - 1, item.selectedSize);
                            setTimeout(() => {
                              showQuantityUpdatedAlert({
                                text: `${item.name}${item.selectedSize && item.selectedSize !== "Standard" ? ` · Size ${item.selectedSize}` : ""}`,
                              });
                            }, 400);
                          }}
                          style={{
                            width: "28px",
                            height: "26px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          &minus;
                        </button>
                        <RollingNumber value={item.qty} width="26px" height="26px" fontSize="11px" />
                        <button
                          type="button"
                          onClick={() => {
                            const max = item.stock ?? 999;
                            if (item.qty >= max) return;
                            updateQty(item.id, item.qty + 1, item.selectedSize);
                            setTimeout(() => {
                              showProductAddedAlert({
                                productName: item.name,
                                size: item.selectedSize,
                              });
                            }, 400);
                          }}
                          style={{
                            width: "28px",
                            height: "26px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item.id, item.selectedSize);
                          showQuantityUpdatedAlert({
                            text: `${item.name}${item.selectedSize && item.selectedSize !== "Standard" ? ` · Size ${item.selectedSize}` : ""}`,
                          });
                        }}
                        style={{
                          fontSize: "9.5px",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          color: "#8a837a",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Checkout Form & Pay Now */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "20px 28px 24px",
              borderTop: "1px solid #f0ece5",
              backgroundColor: "#fcfbfa",
            }}
          >
            {/* Error notifications */}
            {(formError || checkoutError) && (
              <div
                style={{
                  background: "#fff2f0",
                  border: "1px solid #ffccc7",
                  padding: "10px 14px",
                  fontSize: "11px",
                  color: "#cf1322",
                  marginBottom: "14px",
                  lineHeight: "1.4",
                }}
              >
                {formError || checkoutError}
              </div>
            )}

            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#756e65",
                }}
              >
                Official Subtotal
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontFamily: "var(--ui-sans)",
                  fontWeight: 600,
                  color: "#262320",
                }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handlePayNow} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label
                  htmlFor="checkout-email"
                  style={{
                    display: "block",
                    fontSize: "9.5px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#756e65",
                    marginBottom: "4px",
                  }}
                >
                  Email Address *
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="client@example.com"
                  className="cart-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-name"
                  style={{
                    display: "block",
                    fontSize: "9.5px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#756e65",
                    marginBottom: "4px",
                  }}
                >
                  Full Name (Optional)
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="Adaora Okafor"
                  className="cart-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Payment Gateway Toggle */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9.5px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#756e65",
                    marginBottom: "6px",
                  }}
                >
                  Payment Method
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className={`gateway-pill ${gateway === "paystack" ? "selected" : ""}`}
                    onClick={() => setGateway("paystack")}
                  >
                    Paystack (NGN ₦)
                  </button>
                  <button
                    type="button"
                    className={`gateway-pill ${gateway === "stripe" ? "selected" : ""}`}
                    onClick={() => setGateway("stripe")}
                  >
                    Stripe (Cards)
                  </button>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                type="submit"
                className="cart-pay-btn"
                disabled={isCheckingOut}
                style={{ marginTop: "6px" }}
              >
                {isCheckingOut ? (
                  <>
                    <span>Validating &amp; Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Pay Now &bull; {formatPrice(subtotal)}</span>
                    <span style={{ fontSize: "14px" }}>&rarr;</span>
                  </>
                )}
              </button>

              <div
                style={{
                  fontSize: "9px",
                  color: "#8a837a",
                  textAlign: "center",
                  letterSpacing: "0.4px",
                  marginTop: "2px",
                }}
              >
                Secure 256-bit encrypted transaction &bull; Stock validated before payment
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
