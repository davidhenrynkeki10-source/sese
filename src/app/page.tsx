import { SiteNavigation } from "@/components/interactive";

export default function Home() {
    return <>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteNavigation/>
        <main id="main" className="minimal-hero">
            <div className="hero-rect">
                <div className="hero-bg" aria-hidden="true"/>
                <div className="hero-bar" aria-hidden="true"/>
                <div className="hero-wordmark">SéSé</div>
            </div>
        </main>
    </>;
}

