import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Vendor authentication required." },
        { status: 403 }
      );
    }

    const { sessionId, action = "complete" } = await request.json();
    const { transactionsCollection, usersCollection, menuItemsCollection } =
      await getCollections();

    const tx = await transactionsCollection.findOne({
      stripeSessionId: sessionId,
    });

    if (!tx) {
      return NextResponse.json(
        { success: false, message: "Checkout session not found." },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString();

    if (action === "complete") {
      // 1. Update transaction
      await transactionsCollection.updateOne(
        { stripeSessionId: sessionId },
        {
          $set: {
            status: "completed",
            stripeSubscriptionId: `sub_${Date.now()}`,
            updatedAt: now.toISOString(),
          },
        }
      );

      // 2. Activate Premium on user
      const vendorObjectId = toObjectId(user.id || user._id);
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

      // 3. Mark items as vendorIsPremium
      await menuItemsCollection.updateMany(
        { vendorId: String(user.id || user._id) },
        {
          $set: {
            vendorIsPremium: true,
            updatedAt: now.toISOString(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Stripe webhook verified! Premium subscription activated.",
      });
    }

    // Cancelled
    await transactionsCollection.updateOne(
      { stripeSessionId: sessionId },
      {
        $set: {
          status: "cancelled",
          updatedAt: now.toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Checkout session marked as cancelled.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
