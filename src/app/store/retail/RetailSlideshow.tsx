'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const SLIDES = [
  '/images/sese_slide2.jpg',
  '/images/sese_slide3.jpg',
  '/images/sese_slide4.jpg',
  '/images/sese_slide5.jpg',
  '/images/sese_slide6.jpg',
  '/images/sese_slide7.jpg',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RetailSlideshow() {
  const [images, setImages] = useState<string[]>(SLIDES);
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  // phase: 'idle' | 'sliding'
  const [sliding, setSliding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shuffle once on mount
  useEffect(() => {
    setImages(shuffle(SLIDES));
  }, []);

  // Kick off a slide every 4 s
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      const nextIdx = (current + 1) % images.length;
      setNext(nextIdx);
      // Trigger a reflow so the browser registers the starting position
      // before we apply the sliding class. We do this in the next frame.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSliding(true));
      });
    }, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images.length]);

  const handleTransitionEnd = () => {
    if (next !== null) {
      setCurrent(next);
      setNext(null);
      setSliding(false);
    }
  };

  return (
    <>
      <style>{`
        .ss-root {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .ss-slide {
          position: absolute;
          inset: 0;
          will-change: transform;
          transition: transform 2s ease-in-out;
        }
        /* Current slide idles at 0; when sliding, exits to the RIGHT */
        .ss-current { transform: translateX(0%); }
        .ss-current.ss-sliding { transform: translateX(100%); }

        /* Incoming slide starts off-LEFT; when sliding, lands at 0 */
        .ss-next { transform: translateX(-100%); }
        .ss-next.ss-sliding { transform: translateX(0%); }
      `}</style>

      <div className="ss-root">
        {/* Current slide */}
        <div
          className={`ss-slide ss-current${sliding ? ' ss-sliding' : ''}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <Image
            src={images[current]}
            alt={`SESE collection ${current + 1}`}
            fill
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            priority
          />
        </div>

        {/* Incoming slide — only rendered when a transition is queued */}
        {next !== null && (
          <div className={`ss-slide ss-next${sliding ? ' ss-sliding' : ''}`}>
            <Image
              src={images[next]}
              alt={`SESE collection ${next + 1}`}
              fill
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          </div>
        )}
      </div>
    </>
  );
}
