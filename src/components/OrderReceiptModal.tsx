"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/collections";

export default function OrderReceiptModal() {
  const { completedOrder, closeCompletedOrder } = useCart();

  if (!completedOrder) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.7)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        animation: "receiptFadeIn 0.3s ease-out",
      }}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes receiptFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          backgroundColor: "#ffffff",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          border: "1px solid #eae5da",
          padding: "36px",
          boxSizing: "border-box",
          fontFamily: "var(--ui-sans, Arial, sans-serif)",
          overflowY: "auto",
        }}
      >
        {/* Status header */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              fontSize: "22px",
              marginBottom: "12px",
            }}
          >
            &#10003;
          </div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#166534",
              fontWeight: 600,
            }}
          >
            Payment Verified &amp; Confirmed
          </div>
          <h2
            style={{
              fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
              fontSize: "28px",
              color: "#262320",
              margin: "6px 0 0",
              fontWeight: 400,
            }}
          >
            Thank You For Your Order
          </h2>
          <p style={{ fontSize: "12px", color: "#756e65", marginTop: "4px" }}>
            A receipt has been dispatched to{" "}
            <strong style={{ color: "#262320" }}>{completedOrder.customerEmail}</strong>
          </p>
        </div>

        {/* Order Meta details */}
        <div
          style={{
            backgroundColor: "#fcfbfa",
            border: "1px solid #eae5da",
            padding: "16px 20px",
            marginBottom: "24px",
            fontSize: "11px",
            lineHeight: "1.8",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#756e65" }}>Order Number:</span>
            <span style={{ fontWeight: 600, color: "#262320" }}>{completedOrder.orderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#756e65" }}>Payment Reference:</span>
            <span style={{ fontFamily: "monospace", color: "#262320" }}>{completedOrder.reference}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#756e65" }}>Gateway / Channel:</span>
            <span style={{ textTransform: "capitalize", color: "#262320" }}>{completedOrder.gateway}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#756e65" }}>Status:</span>
            <span style={{ color: "#166534", fontWeight: 600 }}>&bull; Paid &amp; In Production</span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#756e65",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            Ordered Pieces
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {completedOrder.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #f0ece5",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "60px",
                    backgroundColor: "#f7f5f0",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#262320" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#756e65" }}>
                    Qty: {item.qty} {item.selectedSize ? `&bull; Size: ${item.selectedSize}` : ""}
                  </div>
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#262320" }}>
                  {formatPrice(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Official Total */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: "16px",
              paddingTop: "12px",
              borderTop: "2px solid #262320",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#262320",
              }}
            >
              Total Paid
            </span>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#262320",
              }}
            >
              {formatPrice(completedOrder.officialTotal)}
            </span>
          </div>
        </div>

        {/* Continue shopping button */}
        <button
          type="button"
          onClick={closeCompletedOrder}
          style={{
            backgroundColor: "#262320",
            color: "#ffffff",
            border: "1px solid #262320",
            padding: "14px",
            fontSize: "10.5px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#000")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#262320")}
        >
          Continue Shopping &rarr;
        </button>
      </div>
    </div>
  );
}
