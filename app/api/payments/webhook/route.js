import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../lib/db";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const stripeKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();

    let event = null;

    if (stripeKey && webhookSecret && signature) {
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(stripeKey);
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        console.warn("Stripe webhook signature check failed:", err.message);
        return NextResponse.json(
          { error: "Webhook signature verification failed." },
          { status: 400 }
        );
      }
    } else {
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON payload." },
          { status: 400 }
        );
      }
    }

    const { transactionsCollection, usersCollection, menuItemsCollection } =
      await getCollections();

    if (event?.type === "checkout.session.completed") {
      const session = event.data?.object || {};
      const vendorId = session.metadata?.vendorId || session.client_reference_id;
      const sessionId = session.id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || null;

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString();

      if (sessionId) {
        await transactionsCollection.updateOne(
          { stripeSessionId: sessionId },
          {
            $set: {
              status: "completed",
              stripeSubscriptionId: subscriptionId,
              updatedAt: now.toISOString(),
            },
          }
        );
      }

      if (vendorId) {
        const vendorObjectId = toObjectId(vendorId);
        if (vendorObjectId) {
          await usersCollection.updateOne(
            { _id: vendorObjectId },
            {
              $set: {
                subscriptionPlan: "premium",
                subscriptionExpiresAt: expiresAt,
                updatedAt: now.toISOString(),
              },
            }
          );
        }

        await menuItemsCollection.updateMany(
          { vendorId: String(vendorId) },
          {
            $set: {
              vendorIsPremium: true,
              updatedAt: now.toISOString(),
            },
          }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
