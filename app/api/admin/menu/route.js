import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Administrator authorization required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    const { menuItemsCollection } = await getCollections();
    const query = {};

    if (status && status !== "all") {
      query.status = status.toLowerCase().trim();
    }
    if (category && category !== "all") {
      query.category = category.trim();
    }
    if (search && search.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, "i");
      query.$or = [
        { itemName: regex },
        { description: regex },
        { businessName: regex },
        { vendorName: regex },
      ];
    }

    const items = await menuItemsCollection
      .find(query)
      .sort({ createdAt: -1 })
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
