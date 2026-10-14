"use client";

import React, { useState, useEffect, useRef } from "react";

export default function RollingNumber({
  value,
  width = "34px",
  height = "30px",
  fontSize = "12px",
}: {
  value: number;
  width?: string;
  height?: string;
  fontSize?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value !== displayValue) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setPrevValue(displayValue);
      setDirection(value > displayValue ? "up" : "down");
      setDisplayValue(value);
      setAnimating(true);

      timeoutRef.current = setTimeout(() => {
        setAnimating(false);
        setPrevValue(null);
      }, 420);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, displayValue]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes rollReelUpOut {
          0% {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
          35% {
            opacity: 0.8;
            filter: blur(0.6px);
          }
          100% {
            transform: translateY(-130%);
            opacity: 0;
            filter: blur(1px);
          }
        }
        @keyframes rollReelUpIn {
          0% {
            transform: translateY(130%);
            opacity: 0;
            filter: blur(1px);
          }
          45% {
            opacity: 0.8;
            filter: blur(0.6px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }
        @keyframes rollReelDownOut {
          0% {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
          35% {
            opacity: 0.8;
            filter: blur(0.6px);
          }
          100% {
            transform: translateY(130%);
            opacity: 0;
            filter: blur(1px);
          }
        }
        @keyframes rollReelDownIn {
          0% {
            transform: translateY(-130%);
            opacity: 0;
            filter: blur(1px);
          }
          45% {
            opacity: 0.8;
            filter: blur(0.6px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }
        .roll-reel-out-up {
          animation: rollReelUpOut 0.4s cubic-bezier(0.2, 0.8, 0.25, 1) forwards !important;
        }
        .roll-reel-in-up {
          animation: rollReelUpIn 0.4s cubic-bezier(0.2, 0.8, 0.25, 1) forwards !important;
        }
        .roll-reel-out-down {
          animation: rollReelDownOut 0.4s cubic-bezier(0.2, 0.8, 0.25, 1) forwards !important;
        }
        .roll-reel-in-down {
          animation: rollReelDownIn 0.4s cubic-bezier(0.2, 0.8, 0.25, 1) forwards !important;
        }
      `}</style>

      {/* Outgoing number rolling out */}
      {animating && prevValue !== null && (
        <span
          key={`prev-${prevValue}`}
          className={direction === "up" ? "roll-reel-out-up" : "roll-reel-out-down"}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize,
            fontWeight: 600,
            color: "#262320",
          }}
        >
          {prevValue}
        </span>
      )}

      {/* Incoming number rolling in */}
      <span
        key={`curr-${displayValue}`}
        className={animating ? (direction === "up" ? "roll-reel-in-up" : "roll-reel-in-down") : ""}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize,
          fontWeight: 600,
          color: "#262320",
        }}
      >
        {displayValue}
      </span>
    </div>
  );
}
