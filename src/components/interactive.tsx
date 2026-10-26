"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { pieces, formatPrice, type Piece } from "@/data/collections";
import { ArtStudy } from "./primitives";
import { useCart } from "@/context/CartContext";
const cartKey = "sese-cart";
function readCart(): string[] { try { return JSON.parse(localStorage.getItem(cartKey) || "[]") as string[]; } catch { return []; } }
export function addToCart(slug: string) { const cart = readCart(); cart.push(slug); localStorage.setItem(cartKey, JSON.stringify(cart)); window.dispatchEvent(new Event("sese:cart")); }
function useCartCount() {
  const { totalItems, isHydrated } = useCart();
  return isHydrated ? totalItems : 0;
}
export function SiteNavigation() {
    const count = useCartCount();
    const { setIsCartOpen } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openTab, setOpenTab] = useState<"about" | "store" | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLElement | null>(null);

    const cancelHoverTimeout = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const cancelLeaveTimeout = () => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
    };

    const handleMouseEnter = (tab: "about" | "store") => {
        cancelLeaveTimeout();
        if (openTab === tab) return;

        cancelHoverTimeout();
        hoverTimeoutRef.current = setTimeout(() => {
            setOpenTab(tab);
            hoverTimeoutRef.current = null;
        }, 500);
    };

    const handleMouseLeave = () => {
        cancelHoverTimeout();
        cancelLeaveTimeout();
        leaveTimeoutRef.current = setTimeout(() => {
            setOpenTab(null);
            leaveTimeoutRef.current = null;
        }, 250);
    };

    const handleCartHover = () => {
        cancelHoverTimeout();
        cancelLeaveTimeout();
        setOpenTab(null);
    };

    const isAboutOpen = openTab === "about";
    const isStoreOpen = openTab === "store";

    const handleClickTab = (tab: "about" | "store", e: React.MouseEvent) => {
        e.stopPropagation();
        cancelHoverTimeout();
        cancelLeaveTimeout();
        setOpenTab((prev) => (prev === tab ? null : tab));
    };

    useEffect(() => {
        const handleClickOutside = (e: Event) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                cancelHoverTimeout();
                cancelLeaveTimeout();
                setOpenTab(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        };
    }, []);

    return <header className={`site-header minimal`}>
        <div className="mobile-menu-toggle">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="menu-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>
        <nav ref={navRef} className={`minimal-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">

            {/* ABOUT tab */}
<div className="store-menu-container">
                <Link href="/about" className="nav-item about" style={{ background: "transparent", border: "none", cursor: "pointer", font: "inherit", padding: 0, fontWeight: 400 }} onClick={() => { setMenuOpen(false); setOpenTab(null); }}>
                    ABOUT
                </Link>
            </div>

            {/* STORE tab */}
            <div
                className={`store-menu-container ${isStoreOpen ? "is-open" : ""}`}
                onMouseEnter={() => handleMouseEnter("store")}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    type="button"
                    className="nav-item store"
                    style={{ background: "transparent", border: "none", cursor: "pointer", font: "inherit", padding: 0, fontWeight: 400 }}
                    onClick={(e) => handleClickTab("store", e)}
                    aria-expanded={isStoreOpen}
                >
                    STORE
                </button>
                <div className="store-subtabs" onMouseEnter={cancelLeaveTimeout} onMouseLeave={handleMouseLeave}>
                    <Link href="/store/retail" className="nav-item" style={{ fontWeight: 400 }} onClick={() => { setMenuOpen(false); setOpenTab(null); }}>RETAIL</Link>
                    <Link href="/store/bespoke" className="nav-item" style={{ fontWeight: 400 }} onClick={() => { setMenuOpen(false); setOpenTab(null); }}>BESPOKE</Link>
                </div>
            </div>

            {/* CART link */}
            <Link
                href="/cart"
                className="nav-item cart"
                style={{ background: "transparent", border: "none", cursor: "pointer", font: "inherit", padding: 0, fontWeight: 400, textDecoration: "none" }}
                onMouseEnter={handleCartHover}
                onClick={() => {
                    setMenuOpen(false);
                    setOpenTab(null);
                }}
            >
                CART ({count})
            </Link>
        </nav>
    </header>;
}
export function ArrowGlyph({ direction = "up" }: { direction?: "up" | "down" }) { return <svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none"><path d={direction === "down" ? "M12 4v15m0 0 6-6m-6 6-6-6" : "M5 19 19 5M7 5h12v12"} stroke="currentColor" strokeWidth="1.25" /></svg>; }
export function ProductCard({ piece, bespoke = false }: { piece: Piece; bespoke?: boolean }) { return <article className="product"><Link className="product-image-link" href={`/product/${piece.slug}`} aria-label={`View ${piece.name}`}><div className="product-visual"><ArtStudy kind={piece.art} /><span className="product-index">S / {piece.id}</span><span className="product-open" aria-hidden="true"><ArrowGlyph /></span></div></Link><div className="product-meta"><Link href={`/product/${piece.slug}`}><h3>{piece.name}</h3></Link><span>{bespoke ? `From ${formatPrice(piece.price)}` : formatPrice(piece.price)}</span></div><div className="product-submeta"><span>{piece.category}</span><Link href={`/product/${piece.slug}`}>{bespoke ? "Enquire" : "View product"}</Link></div></article>; }
export function ProductGrid({ items, bespoke = false }: { items: Piece[]; bespoke?: boolean }) { return <div className="products-grid">{items.map((piece) => <ProductCard key={piece.id} piece={piece} bespoke={bespoke} />)}</div>; }
export function AddToCartButton({ slug }: { slug: string }) {
    const { addToCart: contextAddToCart, setIsCartOpen } = useCart();
    const piece = pieces.find((p) => p.slug === slug);
    return (
        <button
            className="shop-button"
            onClick={() => {
                if (piece) {
                    contextAddToCart(piece);
                    setIsCartOpen(true);
                } else {
                    addToCart(slug);
                }
            }}
        >
            Add to cart <ArrowGlyph />
        </button>
    );
}
export function CartContents() {
    const { cart, totalItems, subtotal, removeFromCart, updateQty, setIsCartOpen } = useCart();
    if (!cart.length) return <p className="cart-empty">Your cart is empty.</p>;
    return (
        <div style={{ marginTop: "24px" }}>
            <div className="cart-items">
                {cart.map((item, i) => (
                    <div className="cart-item" key={`${item.id}-${item.selectedSize}-${i}`} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ position: "relative", width: "64px", height: "80px", backgroundColor: "#f5f2eb", flexShrink: 0 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2>{item.name}</h2>
                            <p>{formatPrice(item.price)} &bull; Qty: {item.qty} {item.selectedSize ? `(${item.selectedSize})` : ""}</p>
                            <div style={{ display: "inline-flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                                <button type="button" onClick={() => updateQty(item.id, item.qty - 1, item.selectedSize)} style={{ border: "1px solid #d7d0c5", padding: "2px 8px", cursor: "pointer" }}>-</button>
                                <span style={{ fontSize: "12px", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                                <button type="button" onClick={() => updateQty(item.id, item.qty + 1, item.selectedSize)} style={{ border: "1px solid #d7d0c5", padding: "2px 8px", cursor: "pointer" }}>+</button>
                            </div>
                        </div>
                        <button type="button" onClick={() => removeFromCart(item.id, item.selectedSize)} style={{ fontSize: "11px", textDecoration: "underline", color: "#8a837a", cursor: "pointer" }}>Remove</button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #d7d0c5", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Total ({totalItems} items)</span>
                <span style={{ fontSize: "20px", fontWeight: 600 }}>{formatPrice(subtotal)}</span>
            </div>
            <button
                type="button"
                className="shop-button"
                style={{ marginTop: "20px", width: "100%", justifyContent: "center" }}
                onClick={() => setIsCartOpen(true)}
            >
                Proceed to Checkout / Pay Now <ArrowGlyph />
            </button>
        </div>
    );
}
export function Newsletter() { const [submitted, setSubmitted] = useState(false); return <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}><label className="sr-only" htmlFor="email">Email address</label><div className="email-field"><input id="email" type="email" required autoComplete="email" placeholder="Email address" /><button aria-label="Subscribe"><svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.25" /></svg></button></div><p className="fine-print" role="status">{submitted ? "Thank you. Subscriptions will open at launch; your email has not been stored." : "Collection notes, occasionally."}</p></form>; }

