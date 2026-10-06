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

type SlotState = 'active' | 'sliding-in' | 'sliding-out' | 'idle';

export default function RetailSlideshow() {
  const [images, setImages] = useState<string[]>(SLIDES);
  const [imgIndex, setImgIndex] = useState(0);

  // Two alternating slots to ensure seamless transitions with zero flicker or backward slide
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [slotImages, setSlotImages] = useState<[string, string]>([SLIDES[0], '']);
  const [slotStates, setSlotStates] = useState<[SlotState, SlotState]>(['active', 'idle']);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shuffle once on mount
  useEffect(() => {
    const shuffled = shuffle(SLIDES);
    setImages(shuffled);
    setSlotImages([shuffled[0], '']);
  }, []);

  // Trigger slide transition every 4s when idle
  useEffect(() => {
    if (slotStates[activeSlot] !== 'active') return;

    timeoutRef.current = setTimeout(() => {
      const nextIdx = (imgIndex + 1) % images.length;
      const nextImage = images[nextIdx];
      const incomingSlot = activeSlot === 0 ? 1 : 0;

      setImgIndex(nextIdx);
      setSlotImages((prev) => {
        const updated: [string, string] = [...prev];
        updated[incomingSlot] = nextImage;
        return updated;
      });
      setSlotStates((prev) => {
        const updated: [SlotState, SlotState] = [...prev];
        updated[activeSlot] = 'sliding-out';
        updated[incomingSlot] = 'sliding-in';
        return updated;
      });
    }, 4000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeSlot, slotStates, imgIndex, images]);

  const handleAnimationEnd = (slot: 0 | 1) => {
    if (slotStates[slot] === 'sliding-in') {
      const outgoingSlot = slot === 0 ? 1 : 0;
      setActiveSlot(slot);
      setSlotStates((prev) => {
        const updated: [SlotState, SlotState] = [...prev];
        updated[slot] = 'active';
        updated[outgoingSlot] = 'idle';
        return updated;
      });
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

        .ss-slot {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          will-change: transform;
        }

        .ss-slot-active {
          transform: translateX(0%);
          z-index: 1;
          display: block;
        }

        .ss-slot-sliding-out {
          -webkit-animation: slideOutToRight 2s ease-in-out forwards;
          animation: slideOutToRight 2s ease-in-out forwards;
          z-index: 1;
          display: block;
        }

        .ss-slot-sliding-in {
          -webkit-animation: slideInFromLeft 2s ease-in-out forwards;
          animation: slideInFromLeft 2s ease-in-out forwards;
          z-index: 2;
          display: block;
        }

        .ss-slot-idle {
          display: none;
        }

        @-webkit-keyframes slideOutToRight {
          0% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideOutToRight {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @-webkit-keyframes slideInFromLeft {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>

      <div className="ss-root">
        {([0, 1] as const).map((slot) => {
          const state = slotStates[slot];
          const src = slotImages[slot];
          if (!src || state === 'idle') return null;

          return (
            <div
              key={slot}
              className={`ss-slot ss-slot-${state}`}
              onAnimationEnd={() => handleAnimationEnd(slot)}
            >
              <Image
                src={src}
                alt="SESE retail collection"
                fill
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                priority
              />
            </div>
          );
        })}
      </div>
    </>
  );
}


