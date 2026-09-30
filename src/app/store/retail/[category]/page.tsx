import Link from 'next/link';
import Image from 'next/image';
import { BackButton, ForwardButton } from './HistoryNav';

const CATEGORIES = ['suits', 'shirts', 'shoes', 'slippers', 'kaftans', 'jackets'];

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const currentCategory = category.toLowerCase();
  let currentIndex = CATEGORIES.indexOf(currentCategory);
  if (currentIndex === -1) currentIndex = 0;

  const displayName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);

  const CATEGORY_IMAGES: Record<string, string> = {
    suits:   '/images/sese_retail_jacket.png',
    jackets: '/images/sese_retail_jacket.png',
    kaftans: '/images/sese_retail_jacket.png',
  };
  const categoryImage = CATEGORY_IMAGES[currentCategory] ?? '/images/man-bag.png';
  const categoryAspect = currentCategory in CATEGORY_IMAGES ? '271 / 388' : '314 / 422';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      fontFamily: 'var(--ui-sans)',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .top-bar {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 28px 0 12px 0;
          flex-shrink: 0;
          width: 100%;
          box-sizing: border-box;
          position: relative;
        }

        .top-bar-left {
          width: 50%;
          display: flex;
          align-items: center;
          padding-left: 40px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .top-bar-right {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-right: 40px;
          box-sizing: border-box;
        }

        .nav-link {
          text-decoration: none;
          color: var(--menu-muted, #a0a0a0);
          font-size: 9.5px;
          line-height: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 0.2s ease, opacity 0.2s ease;
          font-family: var(--ui-sans, sans-serif);
          display: inline-block;
          vertical-align: middle;
        }
        .nav-link:hover { transform: scale(1.18); }

        .side-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--menu-muted, #a0a0a0);
          font-size: 9.5px;
          line-height: 14px;
          letter-spacing: 1px;
          font-family: var(--ui-sans, sans-serif);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .side-btn:hover { transform: scale(1.18); }

        .cat-title {
          font-size: 9.5px;
          line-height: 14px;
          letter-spacing: 1px;
          color: var(--menu-muted, #a0a0a0);
          display: inline-block;
          vertical-align: middle;
        }

        .mobile-cat-title {
          display: none;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .top-bar {
            padding: 24px 20px 8px 20px !important;
            display: flex !important;
            align-items: center !important;
            position: relative !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .top-bar-left {
            width: auto !important;
            padding-left: 0 !important;
            z-index: 2 !important;
          }
          .top-bar-right {
            display: none !important;
          }
          .mobile-cat-title {
            display: block !important;
            text-align: center !important;
            font-family: var(--ui-sans, sans-serif) !important;
            font-size: 9.5px !important;
            font-weight: 400 !important;
            letter-spacing: 1px !important;
            line-height: 14px !important;
            color: var(--menu-muted, #a0a0a0) !important;
            text-transform: uppercase !important;
            margin: 0 0 8px 0 !important;
            flex-shrink: 0 !important;
          }
          .main-content-row {
            overflow: hidden !important;
            flex: 1 !important;
            min-height: 0 !important;
          }
          .left-half {
            display: none !important;
          }
          .right-half {
            width: 100% !important;
            padding: 0 20px !important;
            height: 100% !important;
            flex: 1 !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .panels {
            display: flex !important;
            flex-direction: row !important;
            gap: 8px !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            flex: none !important;
            min-height: 0 !important;
          }
          .panel {
            position: relative !important;
            flex: 1 !important;
            min-width: 0 !important;
            height: auto !important;
            aspect-ratio: var(--panel-aspect, 271 / 388) !important;
          }
          .desktop-forward-btn {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 84px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin-top: 10px !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }
          .mobile-bottom-nav .side-btn {
            font-family: var(--ui-sans, sans-serif) !important;
            font-size: 9.5px !important;
            color: var(--menu-muted, #a0a0a0) !important;
            font-weight: 400 !important;
            letter-spacing: 1px !important;
            line-height: 14px !important;
          }
        }
      `}} />

      {/* ── TOP BAR ── */}
      <div className="top-bar">
        <div className="top-bar-left">
          <Link href="/store/retail" className="nav-link">&lt;&lt; Store</Link>
        </div>
        <div className="top-bar-right">
          <span className="cat-title">{displayName}</span>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="main-content-row" style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: 0,
        width: '100%',
      }}>
        {/* LEFT HALF OF PAGE (includes << button at bottom left) */}
        <div className="left-half" style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 0 35px 40px',
        }}>
          <div>
            <BackButton className="side-btn" />
          </div>
        </div>

        {/* RIGHT HALF OF PAGE (Images, then >> aligned before end of 2nd image) */}
        <div className="right-half" style={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '0 40px 30px 0',
          boxSizing: 'border-box',
        }}>
          {/* Mobile Category Title - Centered above the two images */}
          <div className="mobile-cat-title">
            {displayName}
          </div>

          {/* Two images side by side on the right half */}
          <div className="panels" style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            flex: 1,
            minHeight: 0,
            width: '100%',
            ['--panel-aspect' as string]: categoryAspect,
          }}>
            <div className="panel" style={{ position: 'relative', flex: 1, minWidth: 0, height: '100%' }}>
              <Image
                src={categoryImage}
                alt={`${displayName} – view 1`}
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                priority
              />
            </div>
            <div className="panel" style={{ position: 'relative', flex: 1, minWidth: 0, height: '100%' }}>
              <Image
                src={categoryImage}
                alt={`${displayName} – view 2`}
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                priority
              />
            </div>
          </div>

          {/* >> button before the end of the second image at the bottom on desktop */}
          <div className="desktop-forward-btn" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '12px',
            paddingRight: '12px',
            flexShrink: 0,
          }}>
            <ForwardButton className="side-btn" />
          </div>

          {/* Mobile nav: << and >> on the same line right under the images */}
          <div className="mobile-bottom-nav" style={{ display: 'none' }}>
            <BackButton className="side-btn" />
            <ForwardButton className="side-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}
