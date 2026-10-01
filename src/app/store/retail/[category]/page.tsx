import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import CategoryGallery from './CategoryGallery';

const CATEGORIES = ['suits', 'shirts', 'shoes', 'slippers', 'kaftans', 'jackets'];

function getCategoryImages(category: string): string[] {
  const cat = category.toLowerCase();
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  // 1. Check if public/images folder exists matching category name case-insensitively
  if (fs.existsSync(imagesDir)) {
    try {
      const entries = fs.readdirSync(imagesDir, { withFileTypes: true });
      const match = entries.find((e) => e.isDirectory() && e.name.toLowerCase() === cat);
      if (match) {
        const folderPath = path.join(imagesDir, match.name);
        const files = fs.readdirSync(folderPath)
          .filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
          .map((f) => `/images/${match.name}/${f}`);
        if (files.length > 0) {
          return files;
        }
      }
    } catch {
      // Fallback if readdir fails
    }
  }

  // 2. Predefined fallback mapping
  const CATEGORY_DEFAULTS: Record<string, string[]> = {
    suits: [
      '/images/SUITS/sese_suit1.jpg',
      '/images/SUITS/sese_suit2.jpg',
    ],
    jackets: ['/images/sese_retail_jacket.png'],
    kaftans: ['/images/sese_retail_jacket.png'],
  };

  if (CATEGORY_DEFAULTS[cat]) {
    return CATEGORY_DEFAULTS[cat];
  }

  return ['/images/man-bag.png'];
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const currentCategory = category.toLowerCase();
  let currentIndex = CATEGORIES.indexOf(currentCategory);
  if (currentIndex === -1) currentIndex = 0;

  const displayName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
  const images = getCategoryImages(currentCategory);
  const categoryAspect = ['suits', 'jackets', 'kaftans'].includes(currentCategory) ? '271 / 388' : '314 / 422';

  return (
    <div className="page-root" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      width: '100vw',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      fontFamily: 'var(--ui-sans)',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .page-root {
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }
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
          transition: transform 0.2s ease, color 0.2s ease;
          user-select: none;
          -webkit-user-select: none;
        }
        .side-btn:hover {
          transform: scale(1.18);
          color: #000000;
        }

        .cat-title {
          font-size: 9.5px;
          line-height: 14px;
          letter-spacing: 1px;
          color: var(--menu-muted, #a0a0a0);
          display: inline-block;
          vertical-align: middle;
          text-transform: uppercase;
        }

        .mobile-cat-title {
          display: none;
        }

        .bottom-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 84px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 24px;
          padding: 0;
          flex-shrink: 0;
        }

        @keyframes galleryFadeIn {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }

        .gallery-image {
          animation: galleryFadeIn 0.2s ease-out;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .top-bar {
            padding: 16px 20px 0px 20px !important;
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
            margin: -8px 0 20px 0 !important;
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
            padding: 0 16px 20px 16px !important;
            height: 100% !important;
            flex: 1 !important;
            min-height: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            overflow: hidden !important;
          }
          .panels {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            flex: 0 1 auto !important;
            min-height: 0 !important;
          }
          .panel {
            position: relative !important;
            height: min(45dvh, 310px) !important;
            width: auto !important;
            max-width: 80vw !important;
            aspect-ratio: var(--panel-aspect, 271 / 388) !important;
            margin: 0 auto !important;
            flex: none !important;
          }
          .panel-secondary {
            display: none !important;
          }
          .bottom-nav {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 70px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin-top: 32px !important;
            padding-bottom: 8px !important;
            flex-shrink: 0 !important;
          }
          .bottom-nav .side-btn {
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
          <span className="cat-title">{displayName.toUpperCase()}</span>
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
        {/* LEFT HALF OF PAGE */}
        <div className="left-half" style={{
          width: '50%',
        }} />

        {/* RIGHT HALF OF PAGE: Interactive photo gallery */}
        <CategoryGallery
          displayName={displayName}
          images={images}
          aspectRatio={categoryAspect}
        />
      </div>
    </div>
  );
}
