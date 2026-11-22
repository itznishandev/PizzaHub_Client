import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";

export async function GET() {
  try {
    const { menuItemsCollection } = await getCollections();
    const items = await menuItemsCollection
      .find({ status: "approved" })
      .sort({ vendorIsPremium: -1, averageRating: -1, createdAt: -1 })
      .limit(6)
      .toArray();

    return NextResponse.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
