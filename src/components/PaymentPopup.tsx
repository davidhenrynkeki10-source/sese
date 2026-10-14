"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/collections";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email?: string;
        amount: number;
        ref: string;
        currency?: string;
        onClose: () => void;
        callback: (response: { reference: string; status?: string; trxref?: string }) => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export default function PaymentPopup() {
  const {
    isPaymentModalOpen,
    paymentInitData,
    closePaymentModal,
    verifyAndFinalizePayment,
  } = useCart();

  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paystackScriptLoaded, setPaystackScriptLoaded] = useState(() =>
    typeof window !== "undefined" && Boolean(window.PaystackPop)
  );

  // Load Paystack Inline JS dynamically
  useEffect(() => {
    if (typeof window === "undefined" || window.PaystackPop) return;

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackScriptLoaded(true);
    script.onerror = () => {
      console.warn("Paystack script could not be loaded from remote CDN, using integrated test terminal.");
      setPaystackScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Keep script in document
    };
  }, []);

  const handleLivePaystackTrigger = useCallback(() => {
    if (!paymentInitData || !window.PaystackPop) return false;

    // Check if public key is a real live/test Paystack key (starts with pk_live_ or pk_test_)
    const isRealKey =
      paymentInitData.publicKey &&
      (paymentInitData.publicKey.startsWith("pk_test_") || paymentInitData.publicKey.startsWith("pk_live_")) &&
      !paymentInitData.publicKey.includes("demo");

    if (!isRealKey) {
      return false; // use integrated test modal
    }

    try {
      const handler = window.PaystackPop.setup({
        key: paymentInitData.publicKey,
        amount: Math.round(paymentInitData.amount * 100),
        ref: paymentInitData.reference,
        currency: "NGN",
        onClose: () => {
          // User closed Paystack modal without completing
        },
        callback: async (response) => {
          setIsVerifying(true);
          const success = await verifyAndFinalizePayment(
            response.reference || paymentInitData.reference,
            "paystack"
          );
          setIsVerifying(false);
          if (!success) {
            setErrorMessage("Payment verification failed on the server.");
          }
        },
      });

      handler.openIframe();
      return true;
    } catch (err) {
      console.error("Paystack popup launch error:", err);
      return false;
    }
  }, [paymentInitData, verifyAndFinalizePayment]);

  // If live key is available and gateway is Paystack, attempt to open iframe
  useEffect(() => {
    if (isPaymentModalOpen && paymentInitData && paystackScriptLoaded && !paymentInitData.testMode) {
      const launched = handleLivePaystackTrigger();
      if (launched) {
        // If official Paystack iframe opened, we can close our backdrop
        closePaymentModal();
      }
    }
  }, [isPaymentModalOpen, paymentInitData, paystackScriptLoaded, handleLivePaystackTrigger, closePaymentModal]);

  if (!isPaymentModalOpen || !paymentInitData) return null;

  const handleSimulatePayment = async () => {
    setIsVerifying(true);
    setErrorMessage(null);

    // Workflow step: Server: Verify the payment via direct API call before marking the order as paid.
    const success = await verifyAndFinalizePayment(
      paymentInitData.reference,
      paymentInitData.gateway
    );

    setIsVerifying(false);
    if (!success) {
      setErrorMessage("Server could not verify transaction reference.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 16, 14, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "0px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
          border: "1px solid #d7d0c5",
          padding: "32px",
          boxSizing: "border-box",
          fontFamily: "var(--ui-sans, Arial, sans-serif)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "#8a837a",
                fontWeight: 600,
              }}
            >
              Payment Authorization &bull; {paymentInitData.gateway.toUpperCase()}
            </div>
            <h3
              style={{
                fontFamily: "var(--ui-serif, 'Cormorant Garamond', serif)",
                fontSize: "24px",
                color: "#262320",
                margin: "4px 0 0",
                fontWeight: 400,
              }}
            >
              Order #{paymentInitData.orderId}
            </h3>
          </div>
          <button
            type="button"
            onClick={closePaymentModal}
            disabled={isVerifying}
            style={{
              fontSize: "11px",
              color: "#8a837a",
              cursor: isVerifying ? "not-allowed" : "pointer",
            }}
          >
            [Cancel]
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div
          style={{
            backgroundColor: "#f7f5f0",
            border: "1px solid #eae5da",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#756e65" }}>Transaction Reference:</span>
            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#262320", fontWeight: 600 }}>
              {paymentInitData.reference}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#756e65" }}>Official Total:</span>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#262320" }}>
              {formatPrice(paymentInitData.amount)}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: "#756e65" }}>Status:</span>
            <span style={{ fontSize: "11px", color: "#d97706", fontWeight: 600 }}>
              &bull; Awaiting Verification
            </span>
          </div>
        </div>

        {paymentInitData.testMode && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              padding: "12px 14px",
              fontSize: "11px",
              color: "#166534",
              marginBottom: "20px",
              lineHeight: "1.5",
            }}
          >
            <strong>Interactive Payment Terminal Active:</strong>
            <br />
            No live bank credentials needed. Tapping <em>Approve Payment</em> below executes the live server-side verification endpoint to validate payment status, recalculate stocks, and finalize your order.
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              background: "#fff2f0",
              border: "1px solid #ffccc7",
              padding: "10px 14px",
              fontSize: "11px",
              color: "#cf1322",
              marginBottom: "16px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={isVerifying}
            style={{
              backgroundColor: "#262320",
              color: "#ffffff",
              border: "1px solid #262320",
              padding: "15px",
              fontSize: "10.5px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: isVerifying ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {isVerifying ? "Verifying with Server..." : `Approve & Pay ${formatPrice(paymentInitData.amount)}`}
          </button>

          <button
            type="button"
            onClick={closePaymentModal}
            disabled={isVerifying}
            style={{
              backgroundColor: "transparent",
              color: "#756e65",
              border: "1px solid #eae5da",
              padding: "12px",
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: isVerifying ? "not-allowed" : "pointer",
            }}
          >
            Cancel Payment
          </button>
        </div>

        <div
          style={{
            marginTop: "16px",
            fontSize: "9px",
            textAlign: "center",
            color: "#8a837a",
            letterSpacing: "0.5px",
          }}
        >
          Sésé African Heritage Design House &bull; Encrypted Payment Pipeline
        </div>
      </div>
    </div>
  );
}
