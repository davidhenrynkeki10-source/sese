import Link from "next/link";
import { SiteNavigation } from "@/components/interactive";
import { ArtStudy } from "@/components/primitives";
export default function AboutPage() { return <><SiteNavigation/><main className="about-page"><div><p className="eyebrow">Sésé / About</p><h1>African heritage.<br/><em>Contemporary form.</em></h1><p>Wearables, objects and textiles shaped by material and memory.</p><Link className="text-link" href="/store/retail">Explore the store</Link></div><div className="about-art"><ArtStudy kind="cloth"/></div></main></>; }
