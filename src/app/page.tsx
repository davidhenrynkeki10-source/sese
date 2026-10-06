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
                    width={500}
                    height={994}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'left top',
                    }}
                    priority
                />
            </div>
        </main>
    </>;
}

