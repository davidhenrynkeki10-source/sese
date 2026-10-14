import { NextResponse } from "next/server";
import crypto from "crypto";
import { markOrderAsPaid, getOrder } from "@/data/inventory";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const paystackSignature = request.headers.get("x-paystack-signature");
    const stripeSignature = request.headers.get("stripe-signature");

    // 1. Paystack Webhook Handler
    if (paystackSignature) {
      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (secret) {
        const hash = crypto
          .createHmac("sha512", secret)
          .update(rawBody)
          .digest("hex");

        if (hash !== paystackSignature) {
          console.error("Paystack webhook signature mismatch.");
          return new NextResponse("Invalid signature", { status: 400 });
        }
      }

      const event = JSON.parse(rawBody);

      if (event.event === "charge.success") {
        const reference = event.data?.reference;
        if (reference) {
          const order = getOrder(reference);
          if (order && order.status !== "paid") {
            markOrderAsPaid(reference, event.data);
            console.log(`Order ${order.orderId} marked as paid via Paystack webhook.`);
          }
        }
      }

      return NextResponse.json({ received: true });
    }

    // 2. Stripe Webhook Handler
    if (stripeSignature) {
      const event = JSON.parse(rawBody);

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data?.object;
        const reference = paymentIntent?.metadata?.reference;
        if (reference) {
          const order = getOrder(reference);
          if (order && order.status !== "paid") {
            markOrderAsPaid(reference, paymentIntent);
            console.log(`Order ${order.orderId} marked as paid via Stripe webhook.`);
          }
        }
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true, note: "No recognised payment gateway signature" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
