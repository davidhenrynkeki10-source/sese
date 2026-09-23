import Link from "next/link";
import { SiteNavigation, ProductGrid } from "@/components/interactive";
import { Motion } from "@/components/motion";
import { pieces } from "@/data/collections";
export default function BespokeStore() { const items = pieces.filter(p => p.store === "bespoke"); return <><SiteNavigation/><main className="store-page"><div className="store-heading"><p className="eyebrow">Sésé / Made to order</p><h1>Bespoke Store</h1><p>Made for your way of living.</p></div><ProductGrid items={items} bespoke/><p className="store-note">Customization by enquiry. <Link href="/about">Contact Sésé</Link></p></main><footer className="footer section-pad"><Link href="/store/retail">Explore Retail Store</Link></footer><Motion/></>; }
