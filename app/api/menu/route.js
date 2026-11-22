import { NextResponse } from "next/server";
import { getCollections } from "../../lib/db";
import { PIZZA_CATEGORIES } from "../../lib/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "featured";

    const { menuItemsCollection } = await getCollections();
    const query = { status: "approved" };

    if (search && search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safeSearch, "i");
      query.$or = [
        { itemName: regex },
        { description: regex },
        { businessName: regex },
        { location: regex },
      ];
    }

    if (category && category !== "All") {
      query.category = category.trim();
    }

    if (location && location !== "All") {
      const safeLocation = location.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.location = new RegExp(safeLocation, "i");
    }

    const priceFilter = {};
    if (minPrice && !Number.isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice && !Number.isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      query.price = priceFilter;
    }

    let sortStage = { vendorIsPremium: -1, createdAt: -1 };
    if (sort === "price_asc") {
      sortStage = { price: 1, vendorIsPremium: -1 };
    } else if (sort === "price_desc") {
      sortStage = { price: -1, vendorIsPremium: -1 };
    } else if (sort === "rating") {
      sortStage = { averageRating: -1, totalReviews: -1 };
    } else if (sort === "newest") {
      sortStage = { createdAt: -1 };
    }

    const items = await menuItemsCollection
      .find(query)
      .sort(sortStage)
      .toArray();

    const availableLocations = await menuItemsCollection.distinct("location", {
      status: "approved",
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      items,
      locations: availableLocations.filter(Boolean).sort(),
      categories: PIZZA_CATEGORIES,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { getUserFromRequest } = await import("../../lib/auth-server");
    const user = await getUserFromRequest(request);
    if (!user || user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Vendor authentication required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { itemName, category, description, price, location, images, image } =
      body || {};

    if (!itemName || itemName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Valid item name required." },
        { status: 400 }
      );
    }

    const { menuItemsCollection } = await getCollections();

    // Check free plan limit (3 items)
    if (user.subscriptionPlan !== "premium") {
      const activeCount = await menuItemsCollection.countDocuments({
        vendorId: user.id || user._id,
        status: { $in: ["pending", "approved"] },
      });
      if (activeCount >= 3) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Free plan limit reached (max 3 items). Upgrade to Premium for unlimited publishing.",
          },
          { status: 403 }
        );
      }
    }

    const imgArray = Array.isArray(images) && images.length > 0
      ? images
      : image
      ? [image]
      : [];

    const newItem = {
      vendorId: user.id || user._id,
      vendorName: user.name,
      businessName: user.businessName || `${user.name} Pizzeria`,
      vendorIsPremium: user.subscriptionPlan === "premium",
      itemName: itemName.trim(),
      category: category || "Classic Pizzas",
      description: (description || "").trim(),
      price: Number(price) || 12.99,
      location: (location || user.address || "Gulshan, Dhaka").trim(),
      images: imgArray,
      image: imgArray[0] || "",
      status: "pending",
      averageRating: 5.0,
      totalReviews: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await menuItemsCollection.insertOne(newItem);
    newItem._id = res.insertedId;

    return NextResponse.json(
      {
        success: true,
        message: "Menu item submitted! Awaiting administrator approval.",
        item: newItem,
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
