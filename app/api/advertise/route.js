import { NextResponse } from "next/server";
import { getAdvertiseAnalyticsData } from "@/lib/advertiseAnalytics";

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

    const data = await getAdvertiseAnalyticsData(websiteIds);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/advertise] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
