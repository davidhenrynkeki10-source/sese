"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/inventory";
import { showProductAddedAlert, showQuantityUpdatedAlert } from "@/utils/alerts";
import RollingNumber from "./RollingNumber";

interface ProductPurchaseFormProps {
  product: Product | {
    id: string;
    slug: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image?: string;
    stock?: number;
    sizes?: string[];
    details?: string[];
  };
}

export default function ProductPurchaseForm({ product }: ProductPurchaseFormProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["Standard"];
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [qty, setQty] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const stock = product.stock !== undefined ? product.stock : 5;
  const isOutOfStock = stock <= 0;
  const maxStock = Math.max(1, stock);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty, selectedSize);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 2200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, qty, selectedSize);
    router.push("/cart");
  };

  return (
    <div className="product-purchase-form" style={{ marginTop: "14px", fontFamily: "var(--ui-sans, sans-serif)" }}>
      <style>{`
        .size-chip-btn {
          padding: 6px 12px;
          border: 1px solid #d7d0c5;
          background: #ffffff;
          color: #262320;
          font-size: 10.5px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .size-chip-btn.active {
          background: #262320;
          color: #ffffff;
          border-color: #262320;
        }
        .size-chip-btn:hover:not(.active) {
          border-color: #000000;
        }
        .prod-btn-primary {
          background: #262320;
          color: #ffffff;
          border: 1px solid #262320;
          padding: 11px 16px;
          font-size: 10.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .prod-btn-primary:hover:not(:disabled) {
          background: #000000;
          transform: translateY(-1px);
        }
        .prod-btn-secondary {
          background: transparent;
          color: #262320;
          border: 1px solid #262320;
          padding: 11px 16px;
          font-size: 10.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .prod-btn-secondary:hover:not(:disabled) {
          background: #262320;
          color: #ffffff;
        }
        .prod-btn-primary:disabled,
        .prod-btn-secondary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      {/* Stock Status Indicator */}
      <div style={{ marginBottom: "12px" }}>
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.5px",
            color: isOutOfStock ? "#b52b27" : "#166534",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <span style={{ fontSize: "7px" }}>●</span> In Stock ({stock} left)
            </>
          )}
        </span>
      </div>

      {/* Select Size */}
      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "9px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#756e65",
            marginBottom: "6px",
          }}
        >
          <span>Select Size</span>
          <span style={{ color: "#262320", fontWeight: 600 }}>{selectedSize}</span>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-chip-btn ${selectedSize === size ? "active" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "9px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#756e65",
            marginBottom: "6px",
          }}
        >
          Quantity
        </div>
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
              if (qty <= 1) return;
              const next = qty - 1;
              setQty(next);
              setTimeout(() => {
                showQuantityUpdatedAlert();
              }, 400);
            }}
            disabled={qty <= 1}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#262320",
              cursor: qty <= 1 ? "not-allowed" : "pointer",
            }}
          >
            &minus;
          </button>
          <RollingNumber value={qty} />
          <button
            type="button"
            onClick={() => {
              if (qty >= maxStock) return;
              const next = qty + 1;
              setQty(next);
              setTimeout(() => {
                showProductAddedAlert({ productName: product.name, size: selectedSize });
              }, 400);
            }}
            disabled={qty >= maxStock}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#262320",
              cursor: qty >= maxStock ? "not-allowed" : "pointer",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Buy Now side-by-side */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
        <button
          type="button"
          className="prod-btn-primary"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{ flex: 1 }}
        >
          {addedNotice ? (
            <span>&#10003; Added</span>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            "Add to Cart"
          )}
        </button>

        <button
          type="button"
          className="prod-btn-secondary"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          style={{ flex: 1 }}
        >
          Buy Now &rarr;
        </button>
      </div>

      {/* Craftsmanship & Details */}
      {product.details && product.details.length > 0 && (
        <div style={{ borderTop: "1px solid #eae5da", paddingTop: "12px" }}>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#756e65",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Craftsmanship &amp; Details
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "16px",
              fontSize: "11px",
              color: "#5c554e",
              lineHeight: "1.6",
            }}
          >
            {product.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
