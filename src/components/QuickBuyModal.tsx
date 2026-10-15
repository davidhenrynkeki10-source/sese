"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/collections";
import type { Product } from "@/data/inventory";
import { showProductAddedAlert, showQuantityUpdatedAlert } from "@/utils/alerts";
import RollingNumber from "@/components/RollingNumber";

export default function QuickBuyModal() {
  const { quickBuyProduct, closeQuickBuy } = useCart();
  if (!quickBuyProduct) return null;
  return <QuickBuyDrawer key={quickBuyProduct.id} product={quickBuyProduct} onClose={closeQuickBuy} />;
}

function QuickBuyDrawer({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(() =>
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Standard"
  );
  const [qty, setQty] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const maxStock = product.stock || 1;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, qty, selectedSize);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 2200);

    showProductAddedAlert({
      productName: product.name,
      size: selectedSize,
      onViewCart: () => setIsCartOpen(true),
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, qty, selectedSize);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div
      className="quickbuy-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "stretch",
        animation: "fadeIn 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .qb-drawer {
          width: 100%;
          max-width: 460px;
          height: 100%;
          background: #ffffff;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.12);
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          font-family: var(--ui-sans, Arial, sans-serif);
          overflow-y: auto;
        }
        @media (max-width: 600px) {
          .qb-drawer {
            max-width: 100% !important;
          }
          .qb-img-container {
            height: 280px !important;
          }
        }
        .qb-size-chip {
          padding: 6px 14px;
          border: 1px solid #d7d0c5;
          background: #ffffff;
          color: #262320;
          font-size: 11px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .qb-size-chip.active {
          background: #262320;
          color: #ffffff;
          border-color: #262320;
        }
        .qb-size-chip:hover:not(.active) {
          border-color: #000000;
        }
        .qb-btn-primary {
          background: #262320;
          color: #ffffff;
          border: 1px solid #262320;
          padding: 14px 20px;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, opacity 0.2s ease;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .qb-btn-primary:hover {
          background: #000000;
        }
        .qb-btn-secondary {
          background: transparent;
          color: #262320;
          border: 1px solid #d7d0c5;
          padding: 13px 20px;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }
        .qb-btn-secondary:hover {
          border-color: #000000;
          background: #fbf9f6;
        }
      `}</style>

      <div
        className="qb-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        {/* Top bar with close button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 28px 18px",
            borderBottom: "1px solid #f0ece5",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "#8a837a",
              fontWeight: 500,
            }}
          >
            Quick View / Sésé Retail
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: "10.5px",
              letterSpacing: "1px",
              color: "#8a837a",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8a837a")}
          >
            [Close &times;]
          </button>
        </div>

        {/* Product image container */}
        <div
          className="qb-img-container"
          style={{
            position: "relative",
            width: "100%",
            height: "360px",
            backgroundColor: "#f7f5f0",
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="460px"
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            priority
          />
        </div>

        {/* Product Information */}
        <div style={{ padding: "26px 28px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#756e65",
              }}
            >
              {product.category}
            </span>

            {/* Stock status indicator */}
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.5px",
                color: isOutOfStock ? "#b52b27" : "#306e4a",
                fontWeight: 500,
              }}
            >
              {isOutOfStock ? "Out of Stock" : `● In Stock (${product.stock} left)`}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
              fontSize: "26px",
              lineHeight: "1.2",
              margin: "8px 0 12px",
              color: "#262320",
              fontWeight: 400,
            }}
          >
            {product.name}
          </h2>

          <div
            style={{
              fontSize: "16px",
              fontFamily: "var(--ui-sans)",
              fontWeight: 500,
              color: "#262320",
              marginBottom: "18px",
            }}
          >
            {formatPrice(product.price)}
          </div>

          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.7",
              color: "#5c554e",
              margin: "0 0 24px",
            }}
          >
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#756e65",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Select Size</span>
                <span style={{ color: "#262320", fontWeight: 600 }}>{selectedSize}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    className={`qb-size-chip ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ marginBottom: "26px" }}>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#756e65",
                marginBottom: "8px",
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
                  showQuantityUpdatedAlert();
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#262320",
                  cursor: qty <= 1 ? "not-allowed" : "pointer",
                }}
                disabled={qty <= 1}
              >
                &minus;
              </button>
              <RollingNumber value={qty} width="40px" height="36px" fontSize="13px" />
              <button
                type="button"
                onClick={() => {
                  if (qty >= maxStock) return;
                  setQty((prev) => Math.min(maxStock, prev + 1));
                }}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: "#262320",
                  cursor: "pointer",
                }}
                disabled={qty >= maxStock}
              >
                +
              </button>
            </div>
          </div>

          {/* Craftsmanship Highlights */}
          {product.details && (
            <div style={{ marginBottom: "26px", borderTop: "1px solid #f0ece5", paddingTop: "16px" }}>
              <div
                style={{
                  fontSize: "9.5px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#8a837a",
                  marginBottom: "8px",
                }}
              >
                Craftsmanship &amp; Details
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "16px",
                  fontSize: "11px",
                  color: "#6b645b",
                  lineHeight: "1.8",
                }}
              >
                {product.details.map((detail: string, idx: number) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
            <button
              type="button"
              className="qb-btn-primary"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{ opacity: isOutOfStock ? 0.4 : 1 }}
            >
              {addedNotice ? (
                <>
                  <span>&#10003; Added to Cart</span>
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>

            <button
              type="button"
              className="qb-btn-secondary"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              style={{ opacity: isOutOfStock ? 0.4 : 1 }}
            >
              Buy Now &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
