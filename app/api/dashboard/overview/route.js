import { NextResponse } from "next/server";
import { getCollections } from "../../../lib/db";
import { getUserFromRequest } from "../../../lib/auth-server";

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const {
      usersCollection,
      menuItemsCollection,
      ordersCollection,
      transactionsCollection,
    } = await getCollections();

    const uid = user.id || user._id;

    if (user.role === "vendor") {
      const [items, orders] = await Promise.all([
        menuItemsCollection.find({ vendorId: uid }).toArray(),
        ordersCollection
          .find({ vendorId: uid })
          .sort({ createdAt: -1 })
          .toArray(),
      ]);

      const activeItems = items.filter((i) => i.status === "approved").length;
      const pendingItems = items.filter((i) => i.status === "pending").length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const acceptedOrders = orders.filter((o) => o.status === "accepted").length;
      const rejectedOrders = orders.filter((o) => o.status === "rejected").length;
      const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

      const totalRevenue = orders
        .filter((o) => o.status === "accepted")
        .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

      const categoryMap = new Map();
      items.forEach((item) => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      });

      return NextResponse.json({
        success: true,
        role: "vendor",
        stats: {
          totalMenuItems: items.length,
          activeMenuItems: activeItems,
          pendingMenuItems: pendingItems,
          pendingOrders,
          acceptedOrders,
          totalOrders: orders.length,
          totalOrderRevenue: Number(totalRevenue.toFixed(2)),
          subscriptionPlan: user.subscriptionPlan || "free",
        },
        charts: {
          orderStatus: [
            { label: "Pending", value: pendingOrders, color: "#E07A2E" },
            { label: "Accepted", value: acceptedOrders, color: "#15803D" },
            { label: "Rejected", value: rejectedOrders, color: "#C83E2B" },
            { label: "Cancelled", value: cancelledOrders, color: "#6B7280" },
          ],
          menuByCategory: Array.from(categoryMap.entries()).map(([label, value]) => ({
            label,
            value,
          })),
        },
        recentOrders: orders.slice(0, 5),
      });
    }

    if (user.role === "admin") {
      const [allUsers, allItems, allOrders, allTxs] = await Promise.all([
        usersCollection.find({}).toArray(),
        menuItemsCollection.find({}).toArray(),
        ordersCollection.find({}).toArray(),
        transactionsCollection.find({}).toArray(),
      ]);

      const totalVendors = allUsers.filter((u) => u.role === "vendor").length;
      const totalCustomers = allUsers.filter((u) => u.role === "customer").length;
      const pendingItems = allItems.filter((i) => i.status === "pending").length;
      const approvedItems = allItems.filter((i) => i.status === "approved").length;
      const totalRevenue = allTxs
        .filter((t) => t.status === "completed" || t.status === "succeeded")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const categoryMap = new Map();
      allItems.forEach((item) => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      });

      return NextResponse.json({
        success: true,
        role: "admin",
        stats: {
          totalUsers: allUsers.length,
          totalVendors,
          totalCustomers,
          totalMenuItems: allItems.length,
          pendingMenuItems: pendingItems,
          approvedMenuItems: approvedItems,
          totalTransactions: allTxs.length,
          totalRevenueUsd: totalRevenue,
        },
        charts: {
          menuByCategory: Array.from(categoryMap.entries()).map(([label, value]) => ({
            label,
            value,
          })),
        },
      });
    }

    // Customer overview
    const orders = await ordersCollection
      .find({ customerId: uid })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      role: "customer",
      stats: {
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        acceptedOrders: orders.filter((o) => o.status === "accepted").length,
        rejectedOrders: orders.filter((o) => o.status === "rejected").length,
        cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
