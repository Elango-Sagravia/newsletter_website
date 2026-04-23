// app/advertise/page.js
import AdvertiseClient from "./AdvertiseClient";
import { getAdvertiseAnalyticsData } from "@/lib/advertiseAnalytics";

export const revalidate = 10800; // 3 hours

const title = "Advertise on House of Summary - Reach an Intellectual Audience";
const description =
  "Reach a highly engaged audience of readers and professionals. Grow your brand by advertising on the House of Summary platform today.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "https://www.houseofsummary.com/advertise",
  },
  openGraph: {
    title,
    description,
  },
};

export default async function AdvertisePage() {
  let analyticsData = {
    subscribersMonthly: [],
    opensByCountry: [],
    opensMonthly: [],
    opensByGender: [],
    adClickActivity: [
      { week: "Week 1", lastMonth: 0, thisMonth: 0 },
      { week: "Week 2", lastMonth: 0, thisMonth: 0 },
      { week: "Week 3", lastMonth: 0, thisMonth: 0 },
      { week: "Week 4", lastMonth: 0, thisMonth: 0 },
    ],
    lastCampaignOpenSummary: {
      totalOpens: 0,
      formattedTotalOpens: "0",
    },
  };

  try {
    analyticsData = await getAdvertiseAnalyticsData([1, 3, 7]);
  } catch (error) {
    console.error("Error loading advertise analytics:", error);
  }

  return <AdvertiseClient analyticsData={analyticsData} />;
}
