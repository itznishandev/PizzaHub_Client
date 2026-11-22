import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth-server";

export async function POST(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const params = await paramsPromise;
    const itemId = params?.itemId;
    const { usersCollection } = await getCollections();
    const objectId = toObjectId(user.id || user._id);

    const currentFavs = Array.isArray(user.favorites) ? user.favorites : [];
    const exists = currentFavs.includes(itemId);
    const updatedFavs = exists
      ? currentFavs.filter((id) => id !== itemId)
      : [...currentFavs, itemId];

    await usersCollection.updateOne(
      { _id: objectId },
      { $set: { favorites: updatedFavs, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      favorites: updatedFavs,
      message: exists ? "Removed from favorites." : "Added to favorites.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
