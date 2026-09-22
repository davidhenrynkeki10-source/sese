import { ArtStudy, ArrowLink } from "@/components/primitives";
import { Motion } from "@/components/motion";
import {
  SiteNavigation,
  PreviewDialog,
  ProductGallery,
  CollectionDiscovery,
  JournalCards,
  Newsletter,
  CareLink,
} from "@/components/interactive";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNavigation />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-reveal">
              African heritage / Contemporary design
            </p>
            <h1 id="hero-title" className="hero-reveal">
              Heritage,
              <br />
              <em>Reimagined.</em>
            </h1>
            <div className="hero-bottom hero-reveal">
              <p>
                Carrying the language of African craft
                <br className="desktop-break" /> into the way we live today.
              </p>
              <ArrowLink href="#collection">Explore the collection</ArrowLink>
            </div>
          </div>
            <div className="hero-art">
  <img
    src="/images/sese-logo.png"
    alt="Sésé"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
    }}
  />
</div>
          <div className="hero-foot">
            <span>A design house. A living heritage.</span>
            <a href="#philosophy">
              Scroll to discover <span>↓</span>
            </a>
            <span>01 — 12</span>
          </div>
        </section>
        <section className="statement section-pad" id="philosophy">
          <p className="eyebrow" data-reveal>
            01 / The Sésé philosophy
          </p>
          <div data-reveal>
            <h2>
              Rooted in Africa.
              <br />
              <span>Designed for now.</span>
            </h2>
            <div className="statement-bottom">
              <p>
                We believe heritage is a living language. One that finds new
                expression in the things we wear, the objects we live with, and
                the spaces we call our own. Sésé brings that language into the
                present—with intention.
              </p>
            </div>
          </div>
        </section>
        <section className="campaign" id="collection">
          <div className="campaign-art">
            <ArtStudy kind="cloth" />
            <span className="eyebrow campaign-label">
              SÉSÉ / COLLECTION STUDIES 01
            </span>
            <span className="campaign-art-word" aria-hidden="true">
              In becoming.
            </span>
          </div>
          <div className="campaign-copy" data-reveal>
            <p className="eyebrow">02 / New collection</p>
            <h2>
              The art of
              <br />
              <em>belonging.</em>
            </h2>
            <p>
              Familiar in feeling. New in form.
              <br />A considered collection of wearables, objects and textiles,
              imagined for a life with meaning.
            </p>
            <ArrowLink href="#pieces">Explore collection</ArrowLink>
            <span className="fine-print">
              A first look at the Sésé design language.
            </span>
          </div>
        </section>
        <section className="featured section-pad" id="pieces">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">03 / Selected pieces</p>
              <h2>Objects of intention.</h2>
            </div>
            <span className="fine-print">
              An introduction to our first collection.
              <br />
              Concept pieces · Indicative pricing
            </span>
          </div>
          <ProductGallery />
        </section>
        <section className="heritage section-pad" id="heritage">
          <figure className="heritage-visual" data-reveal>
            <div
              className="heritage-study"
              role="img"
              aria-label="Editorial placeholder: an ivory textile study in light and shadow"
            >
              <ArtStudy kind="cloth" />
              <span className="heritage-study-label eyebrow">
                Material / Memory
              </span>
            </div>
            <figcaption className="eyebrow">
              A living language, carried forward.
            </figcaption>
          </figure>
          <div className="heritage-copy" data-reveal>
            <p className="eyebrow">04 / Our heritage</p>
            <h2>
              Heritage is
              <br />
              not <em>static.</em>
            </h2>
            <p className="heritage-poem">
              It moves through generations,
              <br />
              materials, hands, and ideas.
            </p>
            <p>
              African identity is not one story, one aesthetic, or one moment in
              time. For Sésé, it is a point of departure: a way of thinking
              about beauty, belonging and the things we choose to make.
            </p>
            <p>We carry that language forward.</p>
            <ArrowLink href="#craft">Discover our approach</ArrowLink>
          </div>
        </section>
        <section className="craft section-pad" id="craft">
          <div className="section-heading">
            <p className="eyebrow">05 / A considered practice</p>
            <span className="fine-print">
              From the first thought to the final touch.
            </span>
          </div>
          <div className="craft-grid">
            {[
              {
                name: "Material",
                art: "cloth",
                copy: "A conversation with texture. The beginning of every possibility.",
              },
              {
                name: "Form",
                art: "vessel",
                copy: "Purpose, made visible. Finding the extraordinary in a simple line.",
              },
              {
                name: "Craft",
                art: "fold",
                copy: "Time and attention. The human intention held in every detail.",
              },
            ].map((item, i) => (
              <article key={item.name} data-reveal>
                <div className="craft-image">
                  <ArtStudy kind={item.art} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="discovery section-pad" id="discover">
          <div className="section-heading">
            <p className="eyebrow">06 / Find your expression</p>
            <span className="fine-print">Enter the collection ↙</span>
          </div>
          <CollectionDiscovery />
        </section>
        <section className="signature">
          <p className="eyebrow" data-reveal>
            Sésé / A continuing story
          </p>
          <h2 data-reveal>
            Made with memory.
            <br />
            <em>Designed for tomorrow.</em>
          </h2>
          <div className="signature-bottom">
            <span>African in spirit. Contemporary by design.</span>
            <span aria-hidden="true">SÉSÉ</span>
          </div>
        </section>
        <section className="journal section-pad" id="journal">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">07 / The journal</p>
              <h2>A world, considered.</h2>
            </div>
            <span className="fine-print">
              Ideas, observations and things that stay with us.
            </span>
          </div>
          <JournalCards />
        </section>
        <section className="newsletter section-pad" id="newsletter">
          <div>
            <p className="eyebrow">Stay in the conversation</p>
            <h2>The Sésé Letter</h2>
            <p>Stories, collections and objects from the Sésé world.</p>
          </div>
          <Newsletter />
        </section>
      </main>
      <footer className="footer section-pad">
        <div className="footer-top">
          <p>
            African heritage.
            <br />
            Contemporary design.
            <br />
            <span>A world of Sésé.</span>
          </p>
          <div>
            <h3>Shop</h3>
            <a href="#collection">Collections</a>
            <a href="#pieces">New arrivals</a>
            <a href="#discover">Limited editions</a>
          </div>
          <div>
            <h3>About</h3>
            <a href="#heritage">Our story</a>
            <a href="#craft">Craft</a>
            <a href="#journal">Journal</a>
          </div>
          <div>
            <h3>Client care</h3>
            {["Contact", "Shipping", "Returns", "FAQ"].map((s) => (
              <CareLink key={s}>{s}</CareLink>
            ))}
          </div>
          <div>
            <h3>Social</h3>
            <CareLink>Instagram</CareLink>
            <CareLink>Pinterest</CareLink>
          </div>
        </div>
        <a className="footer-wordmark" href="#" aria-label="Sésé, back to top">
          SÉSÉ
        </a>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sésé. All rights reserved.</span>
          <span>Made with memory.</span>
          <a href="#">Back to top ↑</a>
        </div>
      </footer>
      <PreviewDialog />
      <Motion />
    </>
  );
}
