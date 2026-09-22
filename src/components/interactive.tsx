"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  pieces,
  stories,
  categories,
  formatPrice,
  type Piece,
} from "@/data/collections";
import { ArtStudy } from "./primitives";
import { BrandWordmark } from "./brand-wordmark";
type Preview = { title: string; body: string; art?: string; price?: number };
function showPreview(detail: Preview) {
  window.dispatchEvent(new CustomEvent("sese:preview", { detail }));
}
export function SiteNavigation() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (menu || search) dialog.current?.showModal();
    else dialog.current?.close();
  }, [menu, search]);
  const close = () => {
    setMenu(false);
    setSearch(false);
  };
  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav aria-label="Main navigation" className="nav-left">
          <a href="#pieces">Shop</a>
          <a href="#collection">Collections</a>
          <a href="#heritage">Heritage</a>
        </nav>
        <button
          className="mobile-menu"
          onClick={() => setMenu(true)}
          aria-label="Open navigation"
        >
          Menu <span>☰</span>
        </button>
        <Link className="wordmark" href="/" aria-label="Sésé home">
          <BrandWordmark />
        </Link>
        <nav aria-label="Utility navigation" className="nav-right">
          <a className="journal-nav" href="#journal">
            Journal
          </a>
          <button className="search-button" onClick={() => setSearch(true)}>
            Search
          </button>
          <button
            onClick={() =>
              showPreview({
                title: "Your collection starts here.",
                body: "Your bag is currently empty. Our first collection is taking shape. Explore the design studies and sign up to The Sésé Letter for launch updates.",
              })
            }
          >
            Cart (0)
          </button>
        </nav>
      </header>
      <dialog
        aria-label={menu ? "Navigation" : "Search collection"}
        className="nav-dialog"
        ref={dialog}
        onCancel={close}
        onClose={close}
      >
        <button
          className="dialog-close"
          onClick={close}
          aria-label="Close navigation"
        >
          Close ×
        </button>
        <Link className="wordmark" href="/" onClick={close}>
          <BrandWordmark />
        </Link>
        {menu ? (
          <>
            <nav aria-label="Mobile navigation">
              {[
                ["Shop", "#pieces"],
                ["Collections", "#collection"],
                ["Heritage", "#heritage"],
                ["Journal", "#journal"],
              ].map(([label, href], i) => (
                <a key={label} href={href} onClick={close}>
                  <small>0{i + 1}</small>
                  {label}
                  <span>↗</span>
                </a>
              ))}
            </nav>
            <button
              className="arrow-link"
              onClick={() => {
                setMenu(false);
                setSearch(true);
              }}
            >
              Search the collection <span>↗</span>
            </button>
            <p className="eyebrow">African heritage. Contemporary design.</p>
          </>
        ) : (
          <div className="search-content">
            <p className="eyebrow">Discover the Sésé world</p>
            <label htmlFor="search">What speaks to you?</label>
            <input
              id="search"
              type="search"
              autoFocus
              placeholder="Search pieces, materials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-results">
              {pieces
                .filter((p) =>
                  `${p.name} ${p.category}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      close();
                      showPreview({
                        title: p.name,
                        body: p.description,
                        art: p.art,
                        price: p.price,
                      });
                    }}
                  >
                    {p.name}
                    <span>{p.category} ↗</span>
                  </button>
                ))}
              {!pieces.some((p) =>
                `${p.name} ${p.category}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              ) && (
                <p>No studies found. Try “objects”, “wrap” or “textiles”.</p>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
export function PreviewDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  useEffect(() => {
    const handle = (event: Event) => {
      setPreview((event as CustomEvent<Preview>).detail);
      dialog.current?.showModal();
    };
    window.addEventListener("sese:preview", handle);
    return () => window.removeEventListener("sese:preview", handle);
  }, []);
  return (
    <dialog
      aria-label={preview?.title || "Sésé preview"}
      ref={dialog}
      className="preview-dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) dialog.current?.close();
      }}
    >
      <button
        className="dialog-close"
        onClick={() => dialog.current?.close()}
        aria-label="Close preview"
      >
        Close ×
      </button>
      {preview && (
        <div className="preview-inner">
          {preview.art && <ArtStudy kind={preview.art} />}
          <div className="preview-copy">
            <p className="eyebrow">
              The Sésé world {preview.price ? " / Design study" : ""}
            </p>
            <h2>{preview.title}</h2>
            <p>{preview.body}</p>
            {preview.price && (
              <>
                <p>
                  {formatPrice(preview.price)} <small>— indicative price</small>
                </p>
                <p className="fine-print">
                  A preview of our creative direction. Final materials,
                  availability and pricing will be announced with the
                  collection.
                </p>
              </>
            )}
            <a
              className="arrow-link"
              href="#newsletter"
              onClick={() => dialog.current?.close()}
            >
              Keep in touch <span>↗</span>
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
function Product({ piece }: { piece: Piece }) {
  return (
    <button
      className="product"
      onClick={() =>
        showPreview({
          title: piece.name,
          body: piece.description,
          art: piece.art,
          price: piece.price,
        })
      }
    >
      <div className="product-visual">
        <ArtStudy kind={piece.art} />
        <span className="product-index">S / {piece.id}</span>
        <span className="product-open" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="product-meta">
        <h3>{piece.name}</h3>
        <span>{formatPrice(piece.price)}</span>
      </div>
      <p>
        {piece.category} <span>Design study</span>
      </p>
    </button>
  );
}
export function ProductGallery() {
  const [category, setCategory] = useState("All pieces");
  return (
    <>
      <div className="product-filters" aria-label="Filter design studies">
        {["All pieces", ...categories.slice(0, 3)].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {pieces
          .filter((p) => category === "All pieces" || p.category === category)
          .map((p) => (
            <Product key={p.id} piece={p} />
          ))}
      </div>
    </>
  );
}
export function CollectionDiscovery() {
  return (
    <div className="discovery-list">
      {categories.map((c, i) => (
        <button
          key={c}
          onClick={() =>
            showPreview({
              title: c,
              body:
                i === 3
                  ? "A space for rare expressions and small, considered editions. Join The Sésé Letter to hear when our first limited collection is ready."
                  : `Explore our evolving language of ${c.toLowerCase()}. Our first collection is in development—a considered meeting of African heritage and contemporary life.`,
              art: ["fold", "vessel", "cloth", "fold"][i],
            })
          }
        >
          <span className="eyebrow">0{i + 1}</span>
          <span className="discovery-title">{c}</span>
          <span className="discovery-art">
            <ArtStudy kind={["fold", "vessel", "cloth", "fold"][i]} />
          </span>
          <span className="discovery-arrow">↗</span>
        </button>
      ))}
    </div>
  );
}
export function JournalCards() {
  return (
    <div className="journal-grid">
      {stories.map((story, i) => (
        <button
          className="journal-card"
          key={story.title}
          onClick={() =>
            showPreview({
              title: story.title,
              body: story.body,
              art: story.art,
            })
          }
        >
          <div className={`journal-visual journal-${i}`}>
            <ArtStudy kind={story.art} />
            <span className="eyebrow">Notes from Sésé / 0{i + 1}</span>
          </div>
          <p className="eyebrow">
            {story.category} <span>3 minute pause</span>
          </p>
          <h3>
            {story.title}
            <span>↗</span>
          </h3>
        </button>
      ))}
    </div>
  );
}
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <div className="email-field">
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSubmitted(false);
          }}
        />
        <button aria-label="Subscribe to The Sésé Letter" type="submit">
          ↗
        </button>
      </div>
      <p className="fine-print" role="status">
        {submitted
          ? "Thank you for your interest. Subscriptions will open when Sésé launches; your email has not been stored."
          : "A considered letter, occasionally. Always with intention."}
      </p>
    </form>
  );
}
export function CareLink({ children }: { children: string }) {
  return (
    <button
      onClick={() =>
        showPreview({
          title: children,
          body:
            (
              {
                Contact:
                  "Our client care contact details will be published at launch. For now, explore the Sésé world and revisit us for collection updates.",
                Shipping:
                  "Shipping destinations, delivery timelines and costs will be confirmed when the first collection launches.",
                Returns:
                  "Our returns and exchange policy will be available before orders open.",
                FAQ: "Sésé is a contemporary African heritage design house. This is a preview of our first collection. Pieces and prices are illustrative; ordering is not yet available.",
                Instagram:
                  "Our official Instagram profile will be linked here at launch.",
                Pinterest:
                  "Our official Pinterest profile will be linked here at launch.",
              } as Record<string, string>
            )[children] || "More from Sésé, coming soon.",
        })
      }
    >
      {children}
    </button>
  );
}
