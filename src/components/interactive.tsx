"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { pieces, formatPrice, type Piece } from "@/data/collections";
import { ArtStudy } from "./primitives";
const cartKey = "sese-cart";
function readCart(): string[] { try { return JSON.parse(localStorage.getItem(cartKey) || "[]") as string[]; } catch { return []; } }
export function addToCart(slug: string) { const cart = readCart(); cart.push(slug); localStorage.setItem(cartKey, JSON.stringify(cart)); window.dispatchEvent(new Event("sese:cart")); }
function useCartCount() { const [count, setCount] = useState(0); useEffect(() => { const update = () => setCount(readCart().length); update(); window.addEventListener("sese:cart", update); window.addEventListener("storage", update); return () => { window.removeEventListener("sese:cart", update); window.removeEventListener("storage", update); }; }, []); return count; }
export function SiteNavigation() {
    const count = useCartCount();
    const [menuOpen, setMenuOpen] = useState(false);
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
        <nav className={`minimal-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
            <Link href="/about" className="nav-item about" onClick={() => setMenuOpen(false)}>A B O U T</Link>
            <Link href="/store" className="nav-item store" onClick={() => setMenuOpen(false)}>S T O R E</Link>
            <Link href="/cart" className="nav-item cart" onClick={() => setMenuOpen(false)}>C A R T ({count})</Link>
        </nav>
    </header>;
}
export function ArrowGlyph({ direction = "up" }: { direction?: "up" | "down" }) { return <svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none"><path d={direction === "down" ? "M12 4v15m0 0 6-6m-6 6-6-6" : "M5 19 19 5M7 5h12v12"} stroke="currentColor" strokeWidth="1.25" /></svg>; }
export function ProductCard({ piece, bespoke = false }: { piece: Piece; bespoke?: boolean }) { return <article className="product"><Link className="product-image-link" href={`/product/${piece.slug}`} aria-label={`View ${piece.name}`}><div className="product-visual"><ArtStudy kind={piece.art} /><span className="product-index">S / {piece.id}</span><span className="product-open" aria-hidden="true"><ArrowGlyph /></span></div></Link><div className="product-meta"><Link href={`/product/${piece.slug}`}><h3>{piece.name}</h3></Link><span>{bespoke ? `From ${formatPrice(piece.price)}` : formatPrice(piece.price)}</span></div><div className="product-submeta"><span>{piece.category}</span><Link href={`/product/${piece.slug}`}>{bespoke ? "Enquire" : "View product"}</Link></div></article>; }
export function ProductGrid({ items, bespoke = false }: { items: Piece[]; bespoke?: boolean }) { return <div className="products-grid">{items.map((piece) => <ProductCard key={piece.id} piece={piece} bespoke={bespoke} />)}</div>; }
export function AddToCartButton({ slug }: { slug: string }) { return <button className="shop-button" onClick={() => addToCart(slug)}>Add to cart <ArrowGlyph /></button>; }
export function CartContents() { const [cart, setCart] = useState<string[]>([]); useEffect(() => { const update = () => setCart(readCart()); update(); addEventListener("sese:cart", update); return () => removeEventListener("sese:cart", update); }, []); const items = cart.map((slug) => pieces.find((piece) => piece.slug === slug)).filter((piece): piece is Piece => Boolean(piece)); return <>{items.length ? <div className="cart-items">{items.map((piece, i) => <div className="cart-item" key={`${piece.slug}-${i}`}><ArtStudy kind={piece.art} /><div><h2>{piece.name}</h2><p>{formatPrice(piece.price)}</p></div></div>)}</div> : <p className="cart-empty">Your cart is empty.</p>}<p className="fine-print">Checkout will be available when Sésé commerce is connected.</p></>; }
export function Newsletter() { const [submitted, setSubmitted] = useState(false); return <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}><label className="sr-only" htmlFor="email">Email address</label><div className="email-field"><input id="email" type="email" required autoComplete="email" placeholder="Email address" /><button aria-label="Subscribe"><svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.25" /></svg></button></div><p className="fine-print" role="status">{submitted ? "Thank you. Subscriptions will open at launch; your email has not been stored." : "Collection notes, occasionally."}</p></form>; }

