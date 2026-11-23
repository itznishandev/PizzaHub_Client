import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCollections } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Only vendors can subscribe to Premium." },
        { status: 403 }
      );
    }

    const clientOrigin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://pizzahubweb.vercel.app";

    const stripeKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    const isRealStripe =
      stripeKey &&
      (stripeKey.startsWith("sk_test_") || stripeKey.startsWith("sk_live_")) &&
      stripeKey.length >= 30;

    let officialSession = null;

    if (isRealStripe) {
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(stripeKey);

        officialSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "PizzaHub Vendor Premium Plan",
                  description:
                    "Unlimited pizza listings, verified kitchen status, and priority homepage placement.",
                },
                unit_amount: 2900, // $29.00 USD
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
          mode: "subscription",
          customer_email: user.email,
          client_reference_id: String(user.id || user._id),
          metadata: {
            vendorId: String(user.id || user._id),
            vendorName: user.name,
            vendorEmail: user.email,
          },
          success_url: `${clientOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${clientOrigin}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
        });
      } catch (stripeErr) {
        console.warn("Stripe Checkout Session API warning:", stripeErr.message);
      }
    }

    const sessionId =
      officialSession?.id || `cs_test_${crypto.randomBytes(16).toString("hex")}`;
    const now = new Date().toISOString();

    const { transactionsCollection } = await getCollections();
    await transactionsCollection.insertOne({
      vendorId: user.id || user._id,
      vendorName: user.name,
      vendorEmail: user.email,
      businessName: user.businessName || `${user.name} Kitchen`,
      plan: "premium",
      amount: 29,
      currency: "usd",
      stripeSessionId: sessionId,
      stripeSubscriptionId: officialSession?.subscription || null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    const checkoutUrl =
      officialSession?.url ||
      `${clientOrigin}/payment/checkout?session_id=${sessionId}`;

    return NextResponse.json({
      success: true,
      checkoutUrl,
      sessionId,
      mode: officialSession ? "live_stripe" : "sandbox",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
