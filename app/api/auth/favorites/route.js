import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../lib/db";
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

    const { menuItemsCollection } = await getCollections();
    const favIds = (user.favorites || [])
      .map((id) => toObjectId(id))
      .filter(Boolean);

    const items =
      favIds.length > 0
        ? await menuItemsCollection
            .find({ _id: { $in: favIds }, status: "approved" })
            .toArray()
        : [];

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
