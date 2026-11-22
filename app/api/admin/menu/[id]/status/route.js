import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../../../lib/db";
import { getUserFromRequest } from "../../../../../lib/auth-server";

export async function PATCH(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Administrator authorization required." },
        { status: 403 }
      );
    }

    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);
    const { status } = await request.json();

    if (!["approved", "rejected", "inactive", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status." },
        { status: 400 }
      );
    }

    const { menuItemsCollection } = await getCollections();
    await menuItemsCollection.updateOne(
      { _id: objectId },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      message: `Menu item status updated to ${status}.`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
