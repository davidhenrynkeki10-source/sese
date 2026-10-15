"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CategoryCartButton({ showIcon = false }: { showIcon?: boolean }) {
  const { totalItems, isHydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="nav-link store-cart-link"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        paddingRight: "28px",
        zIndex: 10,
        whiteSpace: "nowrap",
        fontSize: "9.5px",
        fontWeight: 500,
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: "var(--menu-muted, #b0b0b0)",
        fontFamily: "var(--ui-sans, sans-serif)",
        transition: "transform 0.2s ease, color 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#000000";
        e.currentTarget.style.transform = "scale(1.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--menu-muted, #b0b0b0)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {showIcon && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )}
      <span>Cart{isHydrated && totalItems > 0 ? ` (${totalItems})` : ""}</span>
    </Link>
  );
}
