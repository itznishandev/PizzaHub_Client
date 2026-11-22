import { NextResponse } from "next/server";
import { getCollections, sanitizeUser } from "../../../lib/db";
import { comparePassword, signToken } from "../../../lib/auth-server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const { usersCollection } = await getCollections();
    const userDoc = await usersCollection.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!userDoc || !userDoc.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (userDoc.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been suspended by administration.",
        },
        { status: 403 }
      );
    }

    const passwordMatch = await comparePassword(password, userDoc.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = sanitizeUser(userDoc);
    const token = signToken(user);

    return NextResponse.json({
      success: true,
      message: "Signed in successfully!",
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
