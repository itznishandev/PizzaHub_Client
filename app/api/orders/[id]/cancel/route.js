import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth-server";

export async function PATCH(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "customer") {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);

    const { ordersCollection } = await getCollections();
    const order = await ordersCollection.findOne({ _id: objectId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (String(order.customerId) !== String(user.id || user._id)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not your order." },
        { status: 403 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot cancel an order that is already ${order.status}.`,
        },
        { status: 400 }
      );
    }

    await ordersCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
