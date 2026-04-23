import { NextResponse } from "next/server";
import { getWebsiteAnalyticsData } from "@/lib/websiteAnalytics";

export async function POST(request) {
  try {
    const body = await request.json();
    const websiteId = body.website_id ?? body.websiteId;

    if (!websiteId || Number.isNaN(Number(websiteId))) {
      return NextResponse.json(
        { error: "website_id is required and must be a number" },
        { status: 400 },
      );
    }

    const data = await getWebsiteAnalyticsData(Number(websiteId));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/website-opens-monthly] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
