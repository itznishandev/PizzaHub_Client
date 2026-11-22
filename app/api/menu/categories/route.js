import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";
import { PIZZA_CATEGORIES } from "../../../lib/api";

export async function GET() {
  try {
    const { menuItemsCollection } = await getCollections();
    const countsAgg = await menuItemsCollection
      .aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();

    const countMap = new Map(countsAgg.map((row) => [row._id, row.count]));
    const categories = PIZZA_CATEGORIES.map((name) => ({
      name,
      count: countMap.get(name) || 0,
    }));

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
