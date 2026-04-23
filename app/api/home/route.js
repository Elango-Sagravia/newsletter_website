import { NextResponse } from "next/server";
import { getHomeAnalyticsData } from "@/lib/homeAnalytics";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const websiteIds = searchParams.get("website_ids")
      ? searchParams
          .get("website_ids")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((n) => !isNaN(n))
      : [1, 3, 7];

    if (!websiteIds.length) {
      return NextResponse.json(
        { error: "No valid website_ids provided" },
        { status: 400 },
      );
    }

    const data = await getHomeAnalyticsData(websiteIds);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error at /api/home:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
