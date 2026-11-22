import { NextResponse } from "next/server";
import { getCollections, toObjectId, sanitizeUser } from "../../../../../lib/db";
import { getUserFromRequest } from "../../../../../lib/auth-server";

export async function PATCH(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Administrator authorization required." },
        { status: 403 }
      );
    }

    const params = await paramsPromise;
    const targetObjectId = toObjectId(params?.id);
    const { usersCollection } = await getCollections();
    const targetUser = await usersCollection.findOne({ _id: targetObjectId });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (targetUser.role === "admin") {
      return NextResponse.json(
        { success: false, message: "Administrator accounts cannot be blocked." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const nextState =
      typeof body?.isBlocked === "boolean" ? body.isBlocked : !targetUser.isBlocked;

    await usersCollection.updateOne(
      { _id: targetObjectId },
      { $set: { isBlocked: nextState, updatedAt: new Date().toISOString() } }
    );

    const updated = await usersCollection.findOne({ _id: targetObjectId });

    return NextResponse.json({
      success: true,
      message: nextState
        ? `${updated.name} has been blocked.`
        : `${updated.name} has been unblocked.`,
      user: sanitizeUser(updated),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
