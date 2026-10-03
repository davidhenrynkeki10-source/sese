"use client";
import { useEffect, useState, useRef } from "react";
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
    const [hoveredTab, setHoveredTab] = useState<"about" | "store" | null>(null);
    const [clickedTab, setClickedTab] = useState<"about" | "store" | null>(null);
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
        cancelHoverTimeout();
        // Wait before showing on hover ("take a second before it appears")
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredTab(tab);
            if (clickedTab && clickedTab !== tab) {
                setClickedTab(null);
            }
        }, 700);
    };

    const handleMouseLeave = () => {
        cancelHoverTimeout();
        cancelLeaveTimeout();
        leaveTimeoutRef.current = setTimeout(() => {
            setHoveredTab(null);
        }, 220);
    };

    const handleCartHover = () => {
        cancelHoverTimeout();
        cancelLeaveTimeout();
        setHoveredTab(null);
        setClickedTab(null);
    };

    const activeTab = hoveredTab || clickedTab;
    const isAboutOpen = activeTab === "about";
    const isStoreOpen = activeTab === "store";

    const handleClickTab = (tab: "about" | "store", e: React.MouseEvent) => {
        e.stopPropagation();
        cancelHoverTimeout();
        cancelLeaveTimeout();
        if (activeTab === tab) {
            setClickedTab(null);
            setHoveredTab(null);
        } else {
            setClickedTab(tab);
            setHoveredTab(tab);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setClickedTab(null);
                setHoveredTab(null);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
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
            <div
                className="store-menu-container"
                onMouseEnter={() => handleMouseEnter("about")}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    type="button"
                    className="nav-item about"
                    onClick={(e) => handleClickTab("about", e)}
                    aria-expanded={isAboutOpen}
                >
                    ABOUT
                </button>
                {isAboutOpen && (
                    <div className="store-subtabs about-subtabs">
                        <Link href="/about/man" className="nav-item about" onClick={() => { setHoveredTab(null); setClickedTab(null); setMenuOpen(false); }}>MAN</Link>
                        <Link href="/about/brand" className="nav-item about" onClick={() => { setHoveredTab(null); setClickedTab(null); setMenuOpen(false); }}>BRAND</Link>
                    </div>
                )}
            </div>

            <div
                className="store-menu-container"
                onMouseEnter={() => handleMouseEnter("store")}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    type="button"
                    className="nav-item store"
                    onClick={(e) => handleClickTab("store", e)}
                    aria-expanded={isStoreOpen}
                >
                    STORE
                </button>
                {isStoreOpen && (
                    <div className="store-subtabs">
                        <Link href="/store/retail" className="nav-item store" onClick={() => { setHoveredTab(null); setClickedTab(null); setMenuOpen(false); }}>RETAIL</Link>
                        <Link href="/store/bespoke" className="nav-item store" onClick={() => { setHoveredTab(null); setClickedTab(null); setMenuOpen(false); }}>BESPOKE</Link>
                    </div>
                )}
            </div>

            <Link
                href="/cart"
                className="nav-item cart"
                onMouseEnter={handleCartHover}
                onClick={() => { setMenuOpen(false); setHoveredTab(null); setClickedTab(null); }}
            >
                CART ({count})
            </Link>
        </nav>
    </header>;
}
export function ArrowGlyph({ direction = "up" }: { direction?: "up" | "down" }) { return <svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none"><path d={direction === "down" ? "M12 4v15m0 0 6-6m-6 6-6-6" : "M5 19 19 5M7 5h12v12"} stroke="currentColor" strokeWidth="1.25" /></svg>; }
export function ProductCard({ piece, bespoke = false }: { piece: Piece; bespoke?: boolean }) { return <article className="product"><Link className="product-image-link" href={`/product/${piece.slug}`} aria-label={`View ${piece.name}`}><div className="product-visual"><ArtStudy kind={piece.art} /><span className="product-index">S / {piece.id}</span><span className="product-open" aria-hidden="true"><ArrowGlyph /></span></div></Link><div className="product-meta"><Link href={`/product/${piece.slug}`}><h3>{piece.name}</h3></Link><span>{bespoke ? `From ${formatPrice(piece.price)}` : formatPrice(piece.price)}</span></div><div className="product-submeta"><span>{piece.category}</span><Link href={`/product/${piece.slug}`}>{bespoke ? "Enquire" : "View product"}</Link></div></article>; }
export function ProductGrid({ items, bespoke = false }: { items: Piece[]; bespoke?: boolean }) { return <div className="products-grid">{items.map((piece) => <ProductCard key={piece.id} piece={piece} bespoke={bespoke} />)}</div>; }
export function AddToCartButton({ slug }: { slug: string }) { return <button className="shop-button" onClick={() => addToCart(slug)}>Add to cart <ArrowGlyph /></button>; }
export function CartContents() { const [cart, setCart] = useState<string[]>([]); useEffect(() => { const update = () => setCart(readCart()); update(); addEventListener("sese:cart", update); return () => removeEventListener("sese:cart", update); }, []); const items = cart.map((slug) => pieces.find((piece) => piece.slug === slug)).filter((piece): piece is Piece => Boolean(piece)); return <>{items.length ? <div className="cart-items">{items.map((piece, i) => <div className="cart-item" key={`${piece.slug}-${i}`}><ArtStudy kind={piece.art} /><div><h2>{piece.name}</h2><p>{formatPrice(piece.price)}</p></div></div>)}</div> : <p className="cart-empty">Your cart is empty.</p>}<p className="fine-print">Checkout will be available when Sésé commerce is connected.</p></>; }
export function Newsletter() { const [submitted, setSubmitted] = useState(false); return <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}><label className="sr-only" htmlFor="email">Email address</label><div className="email-field"><input id="email" type="email" required autoComplete="email" placeholder="Email address" /><button aria-label="Subscribe"><svg aria-hidden="true" className="arrow-glyph" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.25" /></svg></button></div><p className="fine-print" role="status">{submitted ? "Thank you. Subscriptions will open at launch; your email has not been stored." : "Collection notes, occasionally."}</p></form>; }

