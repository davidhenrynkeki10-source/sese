"use client";

import React, { useState, useEffect, useRef } from "react";

export default function RollingNumber({
  value,
  width = "34px",
  height = "30px",
  fontSize = "13px",
  isUpdating = false,
  spinnerColor = "#f68b1e",
}: {
  value: number;
  width?: string;
  height?: string;
  fontSize?: string;
  isUpdating?: boolean;
  spinnerColor?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [internalUpdating, setInternalUpdating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value !== displayValue) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setInternalUpdating(true);

      timeoutRef.current = setTimeout(() => {
        setDisplayValue(value);
        setInternalUpdating(false);
      }, 480);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, displayValue]);

  const showSpinner = isUpdating || internalUpdating;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes seseRollSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .sese-stepper-roll-icon {
          width: 15px;
          height: 15px;
          border: 2.2px solid ${spinnerColor};
          border-top-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: seseRollSpin 0.6s linear infinite;
        }
      `}</style>

      {showSpinner ? (
        <span
          className="sese-stepper-roll-icon"
          aria-label="Updating quantity"
        />
      ) : (
        <span
          style={{
            fontSize,
            fontWeight: 600,
            color: "#262320",
          }}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
}
