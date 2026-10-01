'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface CategoryGalleryProps {
  displayName: string;
  images: string[];
  aspectRatio: string;
}

export default function CategoryGallery({
  displayName,
  images,
  aspectRatio,
}: CategoryGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = images.length;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Keyboard navigation for convenience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    const minSwipeDistance = 40;

    if (diff > minSwipeDistance) {
      handleNext();
    } else if (diff < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const primaryIndex = total > 0 ? ((currentIndex % total) + total) % total : 0;
  const secondaryIndex = total > 1 ? (((currentIndex + 1) % total) + total) % total : 0;

  const primaryImage = images[primaryIndex] || '/images/man-bag.png';
  const secondaryImage = images[secondaryIndex] || images[0] || '/images/man-bag.png';

  return (
    <div
      className="right-half"
      style={{
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '0 40px 30px 0',
        boxSizing: 'border-box',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Category Title - Centered above the image */}
      <div className="mobile-cat-title">
        {displayName.toUpperCase()}
      </div>

      {/* Images container: 1 image on mobile, 2 images side-by-side on desktop */}
      <div
        className="panels"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          width: '100%',
          ['--panel-aspect' as string]: aspectRatio,
        }}
      >
        {/* Panel 1: Shown on desktop and mobile */}
        <div
          className="panel panel-primary"
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            height: 'auto',
            aspectRatio: aspectRatio,
            maxHeight: 'calc(100vh - 160px)',
          }}
        >
          <Image
            key={`primary-${primaryImage}`}
            src={primaryImage}
            alt={`${displayName} – view ${primaryIndex + 1}`}
            fill
            sizes="(max-width: 800px) 90vw, 25vw"
            style={{
              objectFit: 'fill',
              objectPosition: 'center',
            }}
            className="gallery-image"
            priority
          />
        </div>

        {/* Panel 2: Shown on desktop, hidden on mobile */}
        <div
          className="panel panel-secondary"
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            height: 'auto',
            aspectRatio: aspectRatio,
            maxHeight: 'calc(100vh - 160px)',
          }}
        >
          <Image
            key={`secondary-${secondaryImage}`}
            src={secondaryImage}
            alt={`${displayName} – view ${secondaryIndex + 1}`}
            fill
            sizes="(max-width: 800px) 0vw, 25vw"
            style={{
              objectFit: 'fill',
              objectPosition: 'center',
            }}
            className="gallery-image"
            priority
          />
        </div>
      </div>

      {/* Nav arrows: << and >> to go to next/previous photos */}
      <div className="bottom-nav">
        <button
          type="button"
          onClick={handlePrev}
          className="side-btn"
          aria-label="Previous photo"
          title="Previous photo"
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="side-btn"
          aria-label="Next photo"
          title="Next photo"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}
