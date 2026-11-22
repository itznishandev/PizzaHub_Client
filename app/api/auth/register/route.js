import { NextResponse } from "next/server";
import { getCollections, sanitizeUser } from "../../../lib/db";
import { hashPassword, signToken } from "../../../lib/auth-server";

export async function POST(request) {
  try {
    const { name, email, password, role = "customer", image = "", businessName = "" } =
      await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (role === "admin") {
      return NextResponse.json(
        { success: false, message: "Admin accounts cannot be registered publicly." },
        { status: 403 }
      );
    }

    // Password validation: min 6 chars, uppercase, lowercase
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters and contain uppercase and lowercase letters.",
        },
        { status: 400 }
      );
    }

    const { usersCollection } = await getCollections();
    const cleanEmail = email.toLowerCase().trim();

    const existing = await usersCollection.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    const newUserDoc = {
      name: name.trim(),
      email: cleanEmail,
      image: image || "",
      role: role === "vendor" ? "vendor" : "customer",
      isBlocked: false,
      businessName: role === "vendor" ? (businessName || `${name} Kitchen`).trim() : "",
      subscriptionPlan: "free",
      subscriptionExpiresAt: null,
      phone: "",
      address: "",
      favorites: [],
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    const res = await usersCollection.insertOne(newUserDoc);
    newUserDoc._id = res.insertedId;

    const user = sanitizeUser(newUserDoc);
    const token = signToken(user);

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully!",
        token,
        user,
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
