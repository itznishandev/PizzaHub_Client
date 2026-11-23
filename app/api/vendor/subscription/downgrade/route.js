import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth-server";

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Vendor authentication required." },
        { status: 403 }
      );
    }

    const { usersCollection, menuItemsCollection } = await getCollections();
    const vendorObjectId = toObjectId(user.id || user._id);
    const now = new Date().toISOString();

    await usersCollection.updateOne(
      { _id: vendorObjectId },
      {
        $set: {
          subscriptionPlan: "free",
          subscriptionExpiresAt: null,
          updatedAt: now,
        },
      }
    );

    await menuItemsCollection.updateMany(
      { vendorId: String(user.id || user._id) },
      {
        $set: {
          vendorIsPremium: false,
          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription successfully downgraded to Free Plan.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
