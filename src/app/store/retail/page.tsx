import Link from 'next/link';
import Image from 'next/image';

export default function RetailStore() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      padding: '50px 40px',
      backgroundColor: '#ffffff',
      fontFamily: 'var(--ui-sans)' /* Using the exact font from the nav */
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        .category-link {
          text-decoration: none;
          color: var(--menu-muted); /* Using the exact color */
          font-size: 9.5px;
          letter-spacing: 0.5px;
          display: inline-block;
          transition: transform 0.2s ease, opacity 0.2s ease;
          transform-origin: left center;
          font-family: var(--ui-sans);
          text-transform: none;
        }
        .category-link:hover {
          transform: scale(1.18);
          opacity: 1;
        }
        .home-link-custom {
          text-decoration: none;
          color: var(--menu-muted);
          font-size: 9.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 0.2s ease, opacity 0.2s ease;
          font-family: var(--ui-sans);
        }
        .home-link-custom:hover {
          transform: scale(1.18);
          opacity: 1;
        }

        .marquee-wrapper {
          width: 100%;
          height: 90%;
          position: relative;
          overflow: hidden;
        }
        .marquee-content {
          display: flex;
          width: 133.3333%;
          height: 100%;
          animation: slide-right 8s linear infinite;
        }
        .marquee-item {
          width: 25%;
          height: 100%;
          position: relative;
        }
        @keyframes slide-right {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0%); }
        }

        /* Mobile Adjustments */
        @media (max-width: 700px) {
          .right-section {
            display: none !important;
          }
          .left-section {
            width: 100% !important;
            padding-left: 0px !important;
          }
        }
      `}} />

      {/* Left Section with Navigation */}
      <div className="left-section" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '30%',
        height: '100%',
        paddingLeft: '0px' 
      }}>
        {/* Top Left: Home Link */}
        <Link href="/" className="home-link-custom">
          &lt;&lt; HOME
        </Link>
        
        {/* Bottom Left: Categories */}
        <ul style={{
          listStyleType: 'none',
          padding: 0,
          margin: 0,
          marginBottom: '80px'
        }}>
          {['SUITS', 'SHIRTS', 'SHOES', 'SLIPPERS', 'KAFTANS', 'JACKETS'].map((item) => (
            <li key={item} style={{ marginBottom: '0px', lineHeight: '1.1' }}>
              <Link href={`#${item.toLowerCase()}`} className="category-link">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section with Image */}
      <div className="right-section" style={{
        width: '70%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="marquee-item">
                <Image 
                  src="/images/man-bag.png" 
                  alt={`Retail Fashion ${idx}`} 
                  fill
                  style={{ 
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                  priority={idx <= 3}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
