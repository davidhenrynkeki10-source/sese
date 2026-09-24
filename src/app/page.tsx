import Image from "next/image";
import { SiteNavigation } from "@/components/interactive";

export default function Home() {
    return <>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteNavigation />
        <main id="main" className="minimal-hero">
            <div className="hero-rect" style={{ background: 'transparent' }}>
                <Image
                    src="/images/sese-logo.png"
                    alt="SéSé Logo"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'left' }}
                    priority
                />
            </div>
        </main>
    </>;
}

