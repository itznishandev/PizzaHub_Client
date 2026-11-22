import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { ordersCollection } = await getCollections();
    const uid = user.id || user._id;

    const orders = await ordersCollection
      .find({ customerId: uid })
      .sort({ createdAt: -1 })
      .toArray();

    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    return NextResponse.json({
      success: true,
      orders,
      stats,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
