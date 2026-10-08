"use client";

import Link from 'next/link';
import { useState, useCallback } from 'react';

const BESPOKE_OPTIONS = [
  {
    id: 'appointment',
    title: 'Book an Appointment',
    href: '/store/bespoke/book-appointment',
    boxClass: 'card-box-appointment',
    color: '#9E9E9E',
  },
  {
    id: 'measurements',
    title: 'Upload Measurements',
    href: '/store/bespoke/send-measurements',
    boxClass: 'card-box-measurements',
    color: '#252528',
  },
];

export default function BespokeStore() {
  const [mobileIndex, setMobileIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setMobileIndex((prev) => (prev === 0 ? BESPOKE_OPTIONS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setMobileIndex((prev) => (prev === BESPOKE_OPTIONS.length - 1 ? 0 : prev + 1));
  }, []);

  const currentOption = BESPOKE_OPTIONS[mobileIndex];

  return (
    <div className="bespoke-page-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .bespoke-page-root {
          display: flex;
          height: 100vh;
          height: 100dvh;
          width: 100vw;
          box-sizing: border-box;
          background-color: #ffffff;
          font-family: var(--ui-sans, sans-serif);
          position: relative;
          overflow: hidden;
        }

        .back-link-custom {
          text-decoration: none;
          color: var(--menu-muted, #b0b0b0);
          font-weight: 500;
          font-size: 11.5px;
          letter-spacing: 0.6px;
          display: inline-block;
          transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
          transform-origin: left center;
          font-family: var(--ui-sans, sans-serif);
          text-transform: none;
        }
        .back-link-custom:hover {
          transform: scale(1.18);
          opacity: 1;
          color: #000000;
        }

        /* Desktop Layout */
        .desktop-layout {
          display: flex;
          width: 100%;
          height: 100%;
          padding: 80px 40px 50px 40px;
          box-sizing: border-box;
          justify-content: space-between;
        }

        .desktop-left {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .desktop-right {
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-top: 100px;
          padding-bottom: 0;
          box-sizing: border-box;
        }

        .bespoke-card-option {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          flex: 1;
          min-width: 0;
          cursor: pointer;
        }

        .card-title {
          color: #737373;
          font-size: 9.5px;
          font-weight: 400;
          letter-spacing: 0.3px;
          margin-bottom: 30px;
          font-family: var(--ui-sans, sans-serif);
          display: inline-block;
          transform-origin: left center;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s ease;
        }

        .bespoke-card-option:hover .card-title {
          color: #000000;
          transform: scale(1.18);
        }

        .card-box {
          width: 100%;
          aspect-ratio: 1 / 1;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .bespoke-card-option:hover .card-box {
          opacity: 0.95;
        }

        .card-box-appointment {
          background-color: #9E9E9E;
        }

        .card-box-measurements {
          background-color: #252528;
        }

        /* Mobile Layout */
        .mobile-layout {
          display: none;
        }

        .side-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--menu-muted, #b0b0b0);
          font-weight: 700;
          font-size: 9.5px;
          line-height: 14px;
          letter-spacing: 0.5px;
          font-family: var(--ui-sans, sans-serif);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s ease;
          user-select: none;
          -webkit-user-select: none;
          padding: 4px 4px;
        }
        .side-btn:hover, .side-btn:active {
          transform: scale(1.22);
          color: #000000;
        }

        @keyframes fadeInOpt {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }

        .mobile-active-card {
          animation: fadeInOpt 0.2s ease-out;
        }

        @media (max-width: 768px) {
          .desktop-layout {
            display: none !important;
          }

          .mobile-layout {
            display: flex !important;
            flex-direction: column !important;
            width: 100vw !important;
            height: 100dvh !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          .mobile-top-bar {
            padding: 80px 20px 0px 20px !important;
            display: flex !important;
            justify-content: flex-start !important;
            align-items: center !important;
            flex-shrink: 0 !important;
          }

          .mobile-center-stage {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: center !important;
            padding: 110px 20px 60px 20px !important;
            box-sizing: border-box !important;
          }

          .mobile-option-title {
            font-size: 9.5px !important;
            line-height: 14px !important;
            letter-spacing: 0.8px !important;
            color: #737373 !important;
            font-family: var(--ui-sans, sans-serif) !important;
            margin-bottom: 24px !important;
            text-align: center !important;
            font-weight: 400 !important;
            display: inline-block !important;
            transform-origin: center center !important;
            transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), color 0.2s ease !important;
            text-decoration: none !important;
          }

          .mobile-card-link:hover .mobile-option-title,
          .mobile-option-title:hover {
            color: #000000 !important;
            transform: scale(1.18) !important;
          }

          .mobile-card-link {
            text-decoration: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: min(52vw, 220px) !important;
          }

          .mobile-card-box {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
            transition: opacity 0.2s ease !important;
          }

          .mobile-nav-arrows {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 2px !important;
            margin-top: 24px !important;
          }
        }
      `,
        }}
      />

      {/* Desktop Layout */}
      <div className="desktop-layout">
        {/* Left Section (50%) */}
        <div className="desktop-left">
          <Link href="/" className="back-link-custom">
            &lt;&lt; bespoke
          </Link>
        </div>

        {/* Right Section (50%) */}
        <div className="desktop-right">
          {BESPOKE_OPTIONS.map((option) => (
            <Link key={option.id} href={option.href} className="bespoke-card-option">
              <div className="card-title">{option.title}</div>
              <div className={`card-box ${option.boxClass}`} />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Layout (similar to /store/retail/suits) */}
      <div className="mobile-layout">
        {/* Top Bar with << bespoke */}
        <div className="mobile-top-bar">
          <Link href="/" className="back-link-custom">
            &lt;&lt; bespoke
          </Link>
        </div>

        {/* Center stage with Option Title, Center Square Box, and << >> controls */}
        <div className="mobile-center-stage">
          {/* Title above box */}
          <div className="mobile-option-title">
            {currentOption.title}
          </div>

          {/* Center Square Box */}
          <Link
            href={currentOption.href}
            className="mobile-card-link mobile-active-card"
            key={currentOption.id}
          >
            <div
              className={`mobile-card-box ${currentOption.boxClass}`}
              style={{ backgroundColor: currentOption.color }}
            />
          </Link>

          {/* << >> Nav controls to switch between options */}
          <div className="mobile-nav-arrows">
            <button
              type="button"
              onClick={handlePrev}
              className="side-btn"
              aria-label="Previous option"
            >
              &lt;&lt;
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="side-btn"
              aria-label="Next option"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
