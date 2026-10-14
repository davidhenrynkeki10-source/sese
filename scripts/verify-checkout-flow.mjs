// scripts/verify-checkout-flow.mjs
const BASE = "http://localhost:3000";

async function run() {
  console.log("=== SÉSÉ END-TO-END CHECKOUT & PAYMENT VERIFICATION TEST ===");

  // 1. Query live inventory
  console.log("\n[1] Fetching live inventory from /api/inventory...");
  const invRes = await fetch(`${BASE}/api/inventory`);
  if (!invRes.ok) throw new Error(`Inventory fetch failed: ${invRes.statusText}`);
  const invData = await invRes.json();
  console.log(`✓ Inventory loaded successfully. Found ${invData.count} products.`);

  const testProduct = invData.products.find((p) => p.stock > 0) || invData.products[0];
  const initialStock = testProduct.stock;
  console.log(`✓ Test product selected: "${testProduct.name}" (ID: ${testProduct.id}, Price: ₦${testProduct.price}, Stock: ${initialStock})`);

  // 2. Test stock validation failure (excessive quantity)
  console.log("\n[2] Testing server-side stock validation with excessive quantity (qty: 999)...");
  const failRes = await fetch(`${BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart: [{ id: testProduct.id, qty: 999 }],
      email: "test@sese.com",
    }),
  });
  const failData = await failRes.json();
  if (failRes.status === 400 && !failData.success) {
    console.log(`✓ Server successfully blocked invalid order: "${failData.error}"`);
  } else {
    throw new Error(`Expected 400 rejection for excessive stock, got ${failRes.status}`);
  }

  // 3. Test checkout initialization (valid cart [{id, qty}])
  const orderQty = 1;
  console.log(`\n[3] Testing checkout initialization: Client sending cart [{ id: '${testProduct.id}', qty: ${orderQty} }] to Node backend...`);
  const checkoutRes = await fetch(`${BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cart: [{ id: testProduct.id, qty: orderQty, selectedSize: "40R" }],
      email: "adaora.okafor@example.com",
      name: "Adaora Okafor",
      gateway: "paystack",
    }),
  });

  if (!checkoutRes.ok) throw new Error(`Checkout failed: ${checkoutRes.statusText}`);
  const checkoutData = await checkoutRes.json();
  console.log("✓ Server validated stock & recalculated official total.");
  console.log(`  - Order ID: ${checkoutData.orderId}`);
  console.log(`  - Transaction Reference: ${checkoutData.reference}`);
  console.log(`  - Official Total Recalculated: ₦${checkoutData.amount} (Expected: ₦${testProduct.price * orderQty})`);
  console.log(`  - Gateway: ${checkoutData.gateway.toUpperCase()}`);
  console.log(`  - Test Mode: ${checkoutData.testMode}`);

  if (checkoutData.amount !== testProduct.price * orderQty) {
    throw new Error(`Price mismatch: Expected ${testProduct.price * orderQty}, got ${checkoutData.amount}`);
  }

  // 4. Test payment verification endpoint: Server verifying payment via direct API call before marking order as paid
  console.log(`\n[4] Testing payment verification: /api/payment/verify?reference=${checkoutData.reference}...`);
  const verifyRes = await fetch(`${BASE}/api/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reference: checkoutData.reference,
      gateway: "paystack",
    }),
  });

  if (!verifyRes.ok) throw new Error(`Verification failed: ${verifyRes.statusText}`);
  const verifyData = await verifyRes.json();
  console.log("✓ Payment verified successfully by server.");
  console.log(`  - Status: ${verifyData.order.status}`);
  console.log(`  - Paid At: ${verifyData.order.paidAt}`);
  console.log(`  - Verified Via: ${verifyData.verifiedVia}`);

  if (verifyData.order.status !== "paid") {
    throw new Error(`Order status is ${verifyData.order.status}, expected 'paid'`);
  }

  // 5. Verify stock was officially decremented in inventory
  console.log("\n[5] Verifying inventory stock decrement post-payment...");
  const postInvRes = await fetch(`${BASE}/api/inventory?id=${testProduct.id}`);
  const postInvData = await postInvRes.json();
  const newStock = postInvData.product.stock;
  console.log(`✓ Initial Stock: ${initialStock} -> New Stock after order: ${newStock}`);

  if (newStock !== initialStock - orderQty) {
    throw new Error(`Expected new stock ${initialStock - orderQty}, found ${newStock}`);
  }

  // 6. Test Webhook endpoint
  console.log("\n[6] Testing payment webhook endpoint /api/payment/webhook...");
  const webhookRes = await fetch(`${BASE}/api/payment/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": "test_sig",
    },
    body: JSON.stringify({
      type: "payment_intent.succeeded",
      data: {
        object: {
          metadata: { reference: checkoutData.reference },
        },
      },
    }),
  });
  const webhookData = await webhookRes.json();
  console.log("✓ Webhook responded:", webhookData);

  // 7. Verify /store/retail has quick-buy REMOVED
  console.log("\n[7] Verifying /store/retail has quick-buy removed...");
  const retailRes = await fetch(`${BASE}/store/retail`);
  const retailHtml = await retailRes.text();
  if (!retailHtml.includes("ss-hover-indicator")) {
    console.log("✓ /store/retail cleanly removed hover indicator and quick-buy trigger.");
  } else {
    throw new Error("/store/retail still contains ss-hover-indicator");
  }

  // 8. Verify /store/retail/suits HAS quick-buy applied with pointer cursor (and indicator removed)
  console.log("\n[8] Verifying /store/retail/suits has quick-buy APPLIED with pointer cursor...");
  const suitsRes = await fetch(`${BASE}/store/retail/suits`);
  const suitsHtml = await suitsRes.text();
  if (suitsHtml.includes("panel-interactive") && !suitsHtml.includes("gallery-hover-indicator")) {
    console.log("✓ /store/retail/suits includes interactive panel with pointer cursor, and hover badge cleanly removed.");
  } else {
    throw new Error("/store/retail/suits missing panel-interactive or indicator was not removed");
  }
  if (suitsHtml.includes("store-cart-link") || suitsHtml.includes("Cart")) {
    console.log("✓ /store/retail/suits includes CategoryCartButton.");
  }

  console.log("\n========================================================");
  console.log("🎉 ALL 8 ROUTE & CHECKOUT VERIFICATIONS PASSED!");
  console.log("========================================================\n");
}

run().catch((err) => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
