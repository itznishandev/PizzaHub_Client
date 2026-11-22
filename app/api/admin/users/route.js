import { NextResponse } from "next/server";
import { getCollections, sanitizeUser } from "../../../lib/db";
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
    const role = searchParams.get("role") || "";

    const { usersCollection } = await getCollections();
    const query = {};

    if (role && role !== "all") {
      query.role = role.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, "i");
      query.$or = [{ name: regex }, { email: regex }, { businessName: regex }];
    }

    const docs = await usersCollection.find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      users: docs.map(sanitizeUser),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
