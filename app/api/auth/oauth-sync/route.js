import { NextResponse } from "next/server";
import { getCollections, sanitizeUser } from "../../../lib/db";
import { signToken } from "../../../lib/auth-server";

export async function POST(request) {
  try {
    const { email, name, image } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const { usersCollection } = await getCollections();
    const cleanEmail = email.toLowerCase().trim();

    let userDoc = await usersCollection.findOne({ email: cleanEmail });
    if (!userDoc) {
      const now = new Date().toISOString();
      const newDoc = {
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        image: image || "",
        role: "customer",
        isBlocked: false,
        businessName: "",
        subscriptionPlan: "free",
        subscriptionExpiresAt: null,
        phone: "",
        address: "",
        favorites: [],
        createdAt: now,
        updatedAt: now,
      };
      const res = await usersCollection.insertOne(newDoc);
      newDoc._id = res.insertedId;
      userDoc = newDoc;
    }

    const user = sanitizeUser(userDoc);
    const token = signToken(user);

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
