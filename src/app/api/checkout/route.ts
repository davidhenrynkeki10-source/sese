import { NextResponse } from "next/server";
import {
  validateCartStockAndTotal,
  createOrder,
  type Order,
} from "@/data/inventory";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      cart,
      email,
      name,
      gateway = "paystack", // 'paystack' | 'stripe'
    } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required for receipt and order verification." },
        { status: 400 }
      );
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your cart is empty. Please add items to checkout." },
        { status: 400 }
      );
    }

    // Server-side validation: Stock verification & official total recalculation
    const validation = validateCartStockAndTotal(cart);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || "Inventory stock verification failed.",
        },
        { status: 400 }
      );
    }

    const { officialTotal, items } = validation;
    const orderId = `SESE-ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const reference = `sese_ref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    let accessCode: string | undefined = undefined;
    let authorizationUrl: string | undefined = undefined;
    let testMode = false;
    let publicKey = "";

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/store/retail?order=${orderId}&ref=${reference}`;

    if (gateway === "stripe") {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_sese_stripe_demo";

      if (stripeSecretKey) {
        try {
          // Direct Stripe API call via fetch (zero additional dependencies)
          const params = new URLSearchParams();
          params.append("amount", Math.round(officialTotal * 100).toString()); // Stripe smallest unit
          params.append("currency", "ngn");
          params.append("payment_method_types[]", "card");
          params.append("receipt_email", email);
          params.append("metadata[orderId]", orderId);
          params.append("metadata[reference]", reference);

          const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stripeSecretKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          });

          const stripeData = await stripeRes.json();
          if (stripeData.error) {
            console.error("Stripe initialization error:", stripeData.error);
            testMode = true;
          } else {
            accessCode = stripeData.client_secret;
          }
        } catch (err) {
          console.error("Stripe call failed:", err);
          testMode = true;
        }
      } else {
        testMode = true;
      }
    } else {
      // Default: Paystack (Native Nigerian Naira NGN currency payment gateway)
      const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
      publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_sese_paystack_demo";

      if (paystackSecretKey) {
        try {
          const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${paystackSecretKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              amount: Math.round(officialTotal * 100), // in kobo
              reference,
              callback_url: callbackUrl,
              metadata: {
                orderId,
                customerName: name || email,
                items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
              },
            }),
          });

          const paystackData = await paystackRes.json();
          if (paystackData.status && paystackData.data) {
            accessCode = paystackData.data.access_code;
            authorizationUrl = paystackData.data.authorization_url;
          } else {
            console.warn("Paystack initialize warning:", paystackData.message);
            testMode = true;
          }
        } catch (err) {
          console.error("Paystack call failed:", err);
          testMode = true;
        }
      } else {
        // No live/test key in env: Enable seamlessly integrated test checkout mode
        testMode = true;
        accessCode = `test_access_${reference}`;
      }
    }

    // Save pending order record in server inventory store
    const newOrder: Order = {
      orderId,
      reference,
      accessCode,
      items,
      officialTotal,
      currency: "NGN",
      customerEmail: email,
      customerName: name,
      gateway: gateway as "paystack" | "stripe",
      status: "pending",
      createdAt: new Date().toISOString(),
      testMode,
    };

    createOrder(newOrder);

    return NextResponse.json({
      success: true,
      orderId,
      reference,
      accessCode,
      authorizationUrl,
      amount: officialTotal,
      currency: "NGN",
      gateway,
      publicKey,
      testMode,
      itemsSummary: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, subtotal: i.subtotal })),
    });
  } catch (error) {
    console.error("Checkout route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing checkout.",
      },
      { status: 500 }
    );
  }
}
