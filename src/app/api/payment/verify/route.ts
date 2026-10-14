import { NextResponse } from "next/server";
import { getOrder, markOrderAsPaid } from "@/data/inventory";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("ref");
  const gateway = searchParams.get("gateway") || "paystack";

  if (!reference) {
    return NextResponse.json(
      { success: false, error: "Missing transaction reference." },
      { status: 400 }
    );
  }

  return verifyPayment(reference, gateway);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = body.reference || body.ref;
    const gateway = body.gateway || "paystack";

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Missing transaction reference." },
        { status: 400 }
      );
    }

    return verifyPayment(reference, gateway);
  } catch (err) {
    console.error("Payment verification parse error:", err);
    return NextResponse.json(
      { success: false, error: "Invalid verification request." },
      { status: 400 }
    );
  }
}

async function verifyPayment(reference: string, gateway: string) {
  const order = getOrder(reference);
  if (!order) {
    return NextResponse.json(
      { success: false, error: `Order with reference '${reference}' was not found.` },
      { status: 404 }
    );
  }

  if (order.status === "paid") {
    return NextResponse.json({
      success: true,
      message: "Order already verified and paid.",
      order,
    });
  }

  // 1. Paystack Verification
  if (gateway === "paystack" || order.gateway === "paystack") {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (paystackSecretKey && !order.testMode) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
          },
        });

        const verifyData = await verifyRes.json();

        if (
          verifyData.status &&
          verifyData.data &&
          verifyData.data.status === "success" &&
          verifyData.data.amount >= order.officialTotal * 100
        ) {
          const result = markOrderAsPaid(reference, verifyData.data);
          return NextResponse.json({
            success: true,
            verifiedVia: "paystack-live-api",
            order: result.order,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: verifyData.message || "Paystack payment verification was not successful.",
              details: verifyData.data,
            },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error("Error communicating with Paystack verify API:", err);
        return NextResponse.json(
          { success: false, error: "Network error connecting to Paystack verify service." },
          { status: 502 }
        );
      }
    } else {
      // Test Mode / Demo Simulation verification
      const result = markOrderAsPaid(reference, {
        method: "test_mode_simulation",
        channel: "simulated_card",
        verifiedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        verifiedVia: "test-mode",
        message: "Payment successfully verified in simulation mode.",
        order: result.order,
      });
    }
  }

  // 2. Stripe Verification
  if (gateway === "stripe" || order.gateway === "stripe") {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (stripeSecretKey && !order.testMode) {
      try {
        const stripeRes = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(reference)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
          },
        });

        const stripeData = await stripeRes.json();

        if (stripeData.status === "succeeded") {
          const result = markOrderAsPaid(reference, stripeData);
          return NextResponse.json({
            success: true,
            verifiedVia: "stripe-live-api",
            order: result.order,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: `Stripe PaymentIntent status is '${stripeData.status}'. Payment not finalized.`,
            },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error("Stripe verify error:", err);
        return NextResponse.json(
          { success: false, error: "Network error connecting to Stripe verify API." },
          { status: 502 }
        );
      }
    } else {
      // Test Mode verification
      const result = markOrderAsPaid(reference, {
        method: "test_mode_stripe_simulation",
        verifiedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        verifiedVia: "test-mode",
        order: result.order,
      });
    }
  }

  return NextResponse.json(
    { success: false, error: "Unsupported payment gateway." },
    { status: 400 }
  );
}
