import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth-server";

export async function PATCH(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Vendor authorization required." },
        { status: 403 }
      );
    }

    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);
    const { status, note } = await request.json();

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status must be 'accepted' or 'rejected'." },
        { status: 400 }
      );
    }

    const { ordersCollection } = await getCollections();
    const order = await ordersCollection.findOne({ _id: objectId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (String(order.vendorId) !== String(user.id || user._id)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not your kitchen order." },
        { status: 403 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `Order has already been processed (${order.status}).`,
        },
        { status: 400 }
      );
    }

    await ordersCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          status,
          decisionNote: note || "",
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Order successfully ${status}.`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
