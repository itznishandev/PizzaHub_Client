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

    const sessionId = `cs_test_${crypto.randomBytes(16).toString("hex")}`;
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
      stripeSubscriptionId: null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    const clientOrigin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    return NextResponse.json({
      success: true,
      checkoutUrl: `${clientOrigin}/payment/checkout?session_id=${sessionId}`,
      sessionId,
      mode: "sandbox",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
