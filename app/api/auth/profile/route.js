import { NextResponse } from "next/server";
import { getCollections, toObjectId, sanitizeUser } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function PUT(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, address, businessName, image } = body || {};

    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address.trim();
    if (image !== undefined && image) updates.image = image;
    if (user.role === "vendor" && businessName !== undefined) {
      updates.businessName = businessName.trim();
    }
    updates.updatedAt = new Date().toISOString();

    const { usersCollection } = await getCollections();
    const objectId = toObjectId(user.id || user._id);

    await usersCollection.updateOne({ _id: objectId }, { $set: updates });
    const updated = await usersCollection.findOne({ _id: objectId });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: sanitizeUser(updated),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
