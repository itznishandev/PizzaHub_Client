import { NextResponse } from "next/server";
import { getCollections, toObjectId, sanitizeUser } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function GET(request, { params: paramsPromise }) {
  try {
    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);
    if (!objectId) {
      return NextResponse.json(
        { success: false, message: "Invalid menu item ID." },
        { status: 404 }
      );
    }

    const { menuItemsCollection, usersCollection } = await getCollections();
    const item = await menuItemsCollection.findOne({ _id: objectId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Menu item not found." },
        { status: 404 }
      );
    }

    let vendorProfile = null;
    const vendorObjectId = toObjectId(item.vendorId);
    if (vendorObjectId) {
      const vendorDoc = await usersCollection.findOne({ _id: vendorObjectId });
      if (vendorDoc) {
        vendorProfile = sanitizeUser(vendorDoc);
      }
    }

    return NextResponse.json({
      success: true,
      item: {
        ...item,
        vendor: vendorProfile,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);
    const { menuItemsCollection } = await getCollections();
    const item = await menuItemsCollection.findOne({ _id: objectId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found." },
        { status: 404 }
      );
    }

    if (user.role !== "admin" && String(item.vendorId) !== String(user.id || user._id)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not your menu item." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates = {};
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.description !== undefined) updates.description = body.description;
    if (body.location !== undefined) updates.location = body.location;
    updates.updatedAt = new Date().toISOString();

    await menuItemsCollection.updateOne({ _id: objectId }, { $set: updates });

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);
    const { menuItemsCollection } = await getCollections();
    const item = await menuItemsCollection.findOne({ _id: objectId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found." },
        { status: 404 }
      );
    }

    if (user.role !== "admin" && String(item.vendorId) !== String(user.id || user._id)) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You cannot delete this item." },
        { status: 403 }
      );
    }

    await menuItemsCollection.deleteOne({ _id: objectId });

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
