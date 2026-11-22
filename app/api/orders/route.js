import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../lib/db";
import { getUserFromRequest } from "../../lib/auth-server";

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "customer") {
      return NextResponse.json(
        { success: false, message: "Only authenticated customers can place orders." },
        { status: 403 }
      );
    }

    const { itemId, deliveryDate, deliveryAddress, message } = await request.json();

    if (!deliveryDate) {
      return NextResponse.json(
        { success: false, message: "Delivery date is required." },
        { status: 400 }
      );
    }

    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Please provide a complete delivery address." },
        { status: 400 }
      );
    }

    const itemObjectId = toObjectId(itemId);
    const { menuItemsCollection, ordersCollection } = await getCollections();
    const item = await menuItemsCollection.findOne({ _id: itemObjectId });

    if (!item || item.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Menu item is not currently available for ordering." },
        { status: 404 }
      );
    }

    // Check duplicate pending order
    const existingActive = await ordersCollection.findOne({
      itemId: String(item._id),
      customerId: user.id || user._id,
      deliveryDate,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have an active order for this pizza on the specified date.",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newOrder = {
      itemId: String(item._id),
      itemName: item.itemName,
      itemImage: item.images?.[0] || item.image || "",
      price: item.price,
      vendorId: String(item.vendorId),
      vendorName: item.businessName || item.vendorName || "Pizzeria Partner",
      customerId: user.id || user._id,
      customerName: user.name,
      customerEmail: user.email,
      deliveryDate,
      deliveryAddress: deliveryAddress.trim(),
      message: (message || "").trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    const res = await ordersCollection.insertOne(newOrder);
    newOrder._id = res.insertedId;

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully! Waiting for kitchen acceptance.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
