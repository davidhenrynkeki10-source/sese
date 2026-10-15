"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/collections";
import RollingNumber from "@/components/RollingNumber";
import { showProductAddedAlert, showQuantityUpdatedAlert } from "@/utils/alerts";

export default function CartPage() {
  const {
    cart,
    totalItems,
    subtotal,
    removeFromCart,
    updateQty,
    executeCheckout,
    isCheckingOut,
    checkoutError,
    isHydrated,
  } = useCart();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gateway, setGateway] = useState<"paystack" | "stripe">("paystack");
  const [formError, setFormError] = useState<string | null>(null);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const handleIncrease = (item: (typeof cart)[0]) => {
    const max = item.stock ?? 999;
    if (item.qty >= max) return;
    const itemKey = `${item.id}-${item.selectedSize || "Standard"}`;
    if (updatingKey === itemKey) return;
    setUpdatingKey(itemKey);

    setTimeout(() => {
      const nextQty = item.qty + 1;
      updateQty(item.id, nextQty, item.selectedSize);
      setUpdatingKey(null);
      showProductAddedAlert({
        productName: item.name,
        size: item.selectedSize,
      });
    }, 550);
  };

  const handleDecrease = (item: (typeof cart)[0]) => {
    if (item.qty <= 1) {
      handleRemove(item);
      return;
    }
    const itemKey = `${item.id}-${item.selectedSize || "Standard"}`;
    if (updatingKey === itemKey) return;
    setUpdatingKey(itemKey);

    setTimeout(() => {
      const nextQty = item.qty - 1;
      updateQty(item.id, nextQty, item.selectedSize);
      setUpdatingKey(null);
      showQuantityUpdatedAlert();
    }, 550);
  };

  const handleRemove = (item: (typeof cart)[0]) => {
    removeFromCart(item.id, item.selectedSize);
    setTimeout(() => {
      showQuantityUpdatedAlert({
        text: `${item.name}${item.selectedSize && item.selectedSize !== "Standard" ? ` · Size ${item.selectedSize}` : ""}`,
      });
    }, 150);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid email address for your payment reference.");
      return;
    }

    if (cart.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    await executeCheckout(email.trim(), name.trim(), gateway);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f1f2",
        fontFamily: "var(--ui-sans, Arial, sans-serif)",
        color: "#262320",
      }}
    >
      <style>{`
        .cart-page-header {
          background: #ffffff;
          border-bottom: 1px solid #e0e0e0;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cart-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 1180px;
          margin: 24px auto;
          padding: 0 16px 60px;
          box-sizing: border-box;
        }
        @media (min-width: 860px) {
          .cart-layout-grid {
            grid-template-columns: 1fr 360px;
            gap: 20px;
            align-items: start;
          }
        }
        .cart-card {
          background: #ffffff;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #ebebeb;
          overflow: hidden;
        }
        .cart-item-row {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item-row:last-child {
          border-bottom: none;
        }
        .stepper-btn {
          width: 32px;
          height: 32px;
          background: #f68b1e;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease, opacity 0.15s ease;
          user-select: none;
        }
        .stepper-btn:hover:not(:disabled) {
          background: #e07b14;
        }
        .stepper-btn:disabled {
          background: #b7b7b7 !important;
          color: #ffffff !important;
          cursor: not-allowed;
          opacity: 0.95;
        }
        .stepper-btn-dec {
          background: #f68b1e;
        }
        .remove-action-btn {
          background: transparent;
          border: none;
          color: #f68b1e;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 0;
          transition: color 0.15s ease;
        }
        .remove-action-btn:hover {
          color: #d9700b;
        }
        .checkout-main-btn {
          background: #f68b1e;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 15px 20px;
          width: 100%;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(246, 139, 30, 0.28);
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .checkout-main-btn:hover:not(:disabled) {
          background: #e07b14;
          transform: translateY(-1px);
        }
        .checkout-main-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cart-text-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #dcdcdc;
          border-radius: 4px;
          font-size: 12px;
          color: #262320;
          background: #ffffff;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .cart-text-input:focus {
          border-color: #f68b1e;
        }
      `}</style>

      {/* Top Header */}
      <header className="cart-page-header">
        <Link
          href="/store/retail"
          className="cart-back-link"
          style={{
            fontSize: "9.5px",
            fontWeight: 500,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--menu-muted, #b0b0b0)",
            fontFamily: "var(--ui-sans, sans-serif)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s ease",
            transformOrigin: "left center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.18)";
            e.currentTarget.style.color = "#000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.color = "var(--menu-muted, #b0b0b0)";
          }}
        >
          &lt;&lt; Back to Store
        </Link>
        <Link
          href="/"
          style={{
            fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "3px",
            color: "#262320",
            textDecoration: "none",
          }}
        >
          S É S É
        </Link>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#f68b1e",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart ({isHydrated ? totalItems : 0})
        </div>
      </header>

      {/* Main Cart Content */}
      <main className="cart-layout-grid">
        {!isHydrated ? (
          <div
            className="cart-card"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "70px 24px",
            }}
          >
            <p style={{ fontSize: "13px", color: "#888888", letterSpacing: "0.5px" }}>
              Loading your cart...
            </p>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State */
          <div
            className="cart-card"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "70px 24px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#fdf4eb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f68b1e",
                marginBottom: "20px",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#262320",
                margin: "0 0 8px",
              }}
            >
              Your cart is empty!
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#756e65",
                margin: "0 0 24px",
              }}
            >
              Explore our artisanal tailored suits, kaftans, and accessories to start your order.
            </p>
            <Link
              href="/store/retail"
              className="checkout-main-btn"
              style={{
                display: "inline-block",
                width: "auto",
                padding: "14px 32px",
                textDecoration: "none",
              }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Left Column: Cart Items List */}
            <div className="cart-card">
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#262320",
                }}
              >
                Cart ({totalItems})
              </div>

              <div>
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedSize}-${idx}`} className="cart-item-row">
                    {/* Top Row: Thumbnail + Info + Price */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      {/* Thumbnail */}
                      <div
                        style={{
                          position: "relative",
                          width: "84px",
                          height: "106px",
                          borderRadius: "3px",
                          overflow: "hidden",
                          backgroundColor: "#f7f5f0",
                          border: "1px solid #ebebeb",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={item.image || "/images/man-bag.png"}
                          alt={item.name}
                          fill
                          sizes="84px"
                          style={{ objectFit: "cover", objectPosition: "center top" }}
                        />
                      </div>

                      {/* Title & Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: "1.4",
                            color: "#262320",
                            margin: "0 0 4px",
                          }}
                        >
                          {item.name}
                        </h3>

                        <div
                          style={{
                            fontSize: "11px",
                            color: "#166534",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ fontSize: "8px" }}>●</span> In Stock
                        </div>

                        {item.selectedSize && item.selectedSize !== "Standard" && (
                          <div style={{ fontSize: "11px", color: "#666666" }}>
                            Size: <span style={{ color: "#262320", fontWeight: 600 }}>{item.selectedSize}</span>
                          </div>
                        )}
                        {item.category && (
                          <div style={{ fontSize: "10.5px", color: "#8a837a", marginTop: "2px" }}>
                            Category: {item.category}
                          </div>
                        )}
                      </div>

                      {/* Price on the right */}
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "#262320",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ₦ {(item.price * item.qty).toLocaleString("en-NG")}
                        {item.qty > 1 && (
                          <div style={{ fontSize: "10.5px", color: "#8a837a", fontWeight: 400 }}>
                            (₦ {item.price.toLocaleString("en-NG")} each)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Remove (Left) & Stepper (Right) */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "6px",
                      }}
                    >
                      {/* Remove with Trash Icon */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="remove-action-btn"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Remove
                      </button>

                      {/* Stepper with Roll Spinner */}
                      {(() => {
                        const itemKey = `${item.id}-${item.selectedSize || "Standard"}`;
                        const isUpdating = updatingKey === itemKey;
                        return (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <button
                              type="button"
                              onClick={() => handleDecrease(item)}
                              className="stepper-btn stepper-btn-dec"
                              aria-label="Decrease quantity"
                              disabled={isUpdating || item.qty <= 1}
                            >
                              &minus;
                            </button>
                            <RollingNumber
                              value={item.qty}
                              width="32px"
                              height="32px"
                              fontSize="13px"
                              isUpdating={isUpdating}
                            />
                            <button
                              type="button"
                              onClick={() => handleIncrease(item)}
                              className="stepper-btn"
                              aria-label="Increase quantity"
                              disabled={isUpdating || (item.stock !== undefined && item.qty >= item.stock)}
                            >
                              +
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: CART SUMMARY Card */}
            <div className="cart-card" style={{ padding: "18px 20px" }}>
              <div
                style={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "#262320",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #f0f0f0",
                  marginBottom: "16px",
                }}
              >
                Cart Summary
              </div>

              {/* Subtotal line */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#555555" }}>Subtotal</span>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "#262320" }}>
                  ₦ {subtotal.toLocaleString("en-NG")}
                </span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#555555",
                      marginBottom: "4px",
                    }}
                  >
                    Email for payment receipt *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. client@example.com"
                    className="cart-text-input"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#555555",
                      marginBottom: "4px",
                    }}
                  >
                    Customer Name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="cart-text-input"
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10.5px",
                      fontWeight: 600,
                      color: "#555555",
                      marginBottom: "4px",
                    }}
                  >
                    Payment Method
                  </label>
                  <select
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value as "paystack" | "stripe")}
                    className="cart-text-input"
                    style={{ cursor: "pointer" }}
                  >
                    <option value="paystack">Paystack (NGN Cards, Bank, Transfer, USSD)</option>
                    <option value="stripe">Stripe (USD / International Cards)</option>
                  </select>
                </div>

                {formError && (
                  <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "2px" }}>
                    {formError}
                  </div>
                )}
                {checkoutError && (
                  <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "2px" }}>
                    {checkoutError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="checkout-main-btn"
                  style={{ marginTop: "6px" }}
                >
                  {isCheckingOut ? "Processing..." : `Checkout (₦ ${subtotal.toLocaleString("en-NG")})`}
                </button>
              </form>

              {/* Guarantees */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f0f0f0",
                  fontSize: "11px",
                  color: "#756e65",
                  lineHeight: "1.7",
                }}
              >
                <div>&#10003; 100% Secure Checkout via verified gateway.</div>
                <div>&#10003; White-glove insured delivery from Lagos.</div>
                <div>&#10003; Authenticity certificate with dust bag.</div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
