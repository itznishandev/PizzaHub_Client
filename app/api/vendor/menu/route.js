import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Vendor authorization required." },
        { status: 403 }
      );
    }

    const { menuItemsCollection } = await getCollections();
    const uid = user.id || user._id;

    const items = await menuItemsCollection
      .find({ vendorId: uid })
      .sort({ createdAt: -1 })
      .toArray();

    const activeCount = items.filter((item) =>
      ["pending", "approved"].includes(item.status)
    ).length;

    return NextResponse.json({
      success: true,
      items,
      activeCount,
      maxFreeItems: 3,
      subscriptionPlan: user.subscriptionPlan || "free",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
