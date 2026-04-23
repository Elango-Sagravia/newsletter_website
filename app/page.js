import HomeClient from "./HomeClient";
import { getHomeAnalyticsData } from "@/lib/homeAnalytics";

export const revalidate = 3600; // ⏱️ revalidate every 1 hour

export const metadata = {
  title: "House of Summary | Verified News, Summarized",
  description:
    "Two friends on opposite sides of the world went door to door selling magazines in their neighbourhood. Two decades later House of Summary is born.",
  alternates: {
    canonical: "https://www.houseofsummary.com/",
  },
};

export default async function HomePage() {
  let analyticsData = {
    subscribersMonthly: [],
    opensMonthly: [],
    adClickActivity: [
      { week: "Week 1", lastMonth: 0, thisMonth: 0 },
      { week: "Week 2", lastMonth: 0, thisMonth: 0 },
      { week: "Week 3", lastMonth: 0, thisMonth: 0 },
      { week: "Week 4", lastMonth: 0, thisMonth: 0 },
    ],
  };

  try {
    analyticsData = await getHomeAnalyticsData([1, 3, 7]);
  } catch (error) {
    console.error("Error loading home analytics:", error);
  }

  return <HomeClient analyticsData={analyticsData} />;
}
