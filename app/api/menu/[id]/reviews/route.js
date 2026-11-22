import { NextResponse } from "next/server";
import { getCollections, toObjectId } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth-server";

export async function POST(request, { params: paramsPromise }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "customer") {
      return NextResponse.json(
        { success: false, message: "Only customers can submit reviews." },
        { status: 403 }
      );
    }

    const params = await paramsPromise;
    const objectId = toObjectId(params?.id);
    const body = await request.json();
    const { rating = 5, comment = "" } = body;

    const { menuItemsCollection } = await getCollections();
    const item = await menuItemsCollection.findOne({ _id: objectId });
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Pizza item not found." },
        { status: 404 }
      );
    }

    const newReview = {
      userId: user.id || user._id,
      userName: user.name,
      userImage: user.image,
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const currentReviews = Array.isArray(item.reviews) ? item.reviews : [];
    const updatedReviews = [newReview, ...currentReviews];
    const avg =
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

    await menuItemsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          reviews: updatedReviews,
          averageRating: Number(avg.toFixed(1)),
          totalReviews: updatedReviews.length,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully!",
      review: newReview,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
