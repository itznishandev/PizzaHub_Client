import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";
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

    const { transactionsCollection } = await getCollections();
    const transactions = await transactionsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
