import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArtStudy } from "@/components/primitives";
import { productBySlug, formatPrice } from "@/data/collections";
import { getAllProducts } from "@/data/inventory";
import ProductPurchaseForm from "@/components/ProductPurchaseForm";
import CategoryCartButton from "@/components/CategoryCartButton";

export function generateStaticParams() {
  const all = getAllProducts();
  return all.map((piece) => ({ slug: piece.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = productBySlug(slug);

  if (!piece) {
    notFound();
  }

  const bespoke = piece.store === "bespoke";
  const categorySlug = piece.category.toLowerCase();
  const backHref = bespoke ? "/store/bespoke" : `/store/retail/${categorySlug}`;

  return (
    <div className="product-page-root">
      <style>{`
        .product-page-root {
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          background-color: #ffffff;
        }
        .product-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 48px 8px 48px;
          flex-shrink: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .product-main-container {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px 48px 28px 48px;
          max-width: 1220px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .product-detail-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          align-items: center;
          width: 100%;
          min-height: 0;
        }
        .product-gallery-frame {
          position: relative;
          height: min(65vh, 520px);
          aspect-ratio: 271 / 388;
          max-width: 100%;
          margin: 0 auto;
          background-color: #f7f5f0;
          border: 1px solid #eae5da;
          overflow: hidden;
        }
        @media (min-width: 860px) {
          .product-detail-layout {
            grid-template-columns: minmax(280px, 1fr) minmax(360px, 1.15fr);
            gap: 60px;
          }
          .product-gallery-frame {
            margin: 0 0 0 auto;
          }
        }
        @media (max-width: 860px) {
          .product-page-root {
            height: auto !important;
            min-height: 100dvh !important;
            overflow-y: auto !important;
          }
          .product-top-bar {
            padding: 20px 20px 0 20px !important;
          }
          .product-main-container {
            padding: 16px 20px 40px 20px !important;
            height: auto !important;
          }
          .product-gallery-frame {
            height: 380px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>

      {/* Top bar with Back Link and Cart Button with Icon */}
      <div className="product-top-bar">
        <Link
          href={backHref}
          style={{
            fontSize: "9.5px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--menu-muted, #8a837a)",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.2s, transform 0.2s",
            textDecoration: "none",
          }}
        >
          &lt;&lt; Back
        </Link>
        <CategoryCartButton showIcon={true} />
      </div>

      <main className="product-main-container">
        {/* Product Grid: Photography on Left, Purchasing details on Right side-by-side */}
        <div className="product-detail-layout">
          {/* Gallery Column */}
          <div
            className="product-gallery-col"
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="product-gallery-frame">
              {piece.image ? (
                <Image
                  src={piece.image}
                  alt={piece.name}
                  fill
                  priority
                  sizes="(max-width: 860px) 90vw, 40vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              ) : piece.art ? (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArtStudy kind={piece.art} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Details & Purchasing Column */}
          <div
            className="product-info-col"
            style={{
              maxWidth: "480px",
              width: "100%",
              fontFamily: "var(--ui-sans, sans-serif)",
            }}
          >
            {/* Product Title */}
            <h1
              style={{
                fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(24px, 2.3vw, 34px)",
                lineHeight: "1.15",
                color: "#262320",
                margin: "0 0 8px",
                fontWeight: 400,
              }}
            >
              {piece.name}
            </h1>

            {/* Price */}
            <div
              style={{
                fontSize: "19px",
                fontWeight: 600,
                color: "#262320",
                marginBottom: "10px",
              }}
            >
              {bespoke ? `From ${formatPrice(piece.price)}` : formatPrice(piece.price)}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "12.5px",
                lineHeight: "1.65",
                color: "#5c554e",
                margin: "0 0 14px",
              }}
            >
              {piece.description}
            </p>

            {/* Purchasing Form for retail or Bespoke enquiry */}
            {bespoke ? (
              <div style={{ marginTop: "20px" }}>
                <p style={{ fontSize: "12px", color: "#756e65", marginBottom: "14px" }}>
                  Bespoke pieces are tailored individually according to custom measurements and private consultation.
                </p>
                <Link
                  className="shop-button"
                  href="/store/bespoke"
                  style={{ display: "inline-flex", justifyContent: "center", width: "100%" }}
                >
                  Book Bespoke Consultation &rarr;
                </Link>
              </div>
            ) : (
              <ProductPurchaseForm product={piece} />
            )}

            {/* Assurance footer */}
            <div
              style={{
                borderTop: "1px solid #eae5da",
                paddingTop: "10px",
                marginTop: "10px",
                fontSize: "10px",
                color: "#8a837a",
                lineHeight: "1.55",
              }}
            >
              <div>&bull; Insured nationwide and international white-glove shipping.</div>
              <div>&bull; Hand-crafted with artisanal textile integrity in Lagos, Nigeria.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
