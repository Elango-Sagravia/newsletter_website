"use client";
import Hero from "@/components/hero/hero";
import HomeNewsletterAdsGrow from "../components/homeNewsletterAdsGrow/homeNewsletterAdsGrow";
import HomePopularNewsletters from "../components/homePopularNewsletters/homePopularNewsletters";
import HomeWorldEngages from "../components/homeWorldEngages/homeWorldEngages";
import HomeLovedByReaders from "../components/homeLovedByReaders/homeLovedByReaders";
import HomeSocialconversations from "../components/homeSocialConversations/homeSocialConversations";
import HomeLatestStories from "../components/homeLatestStories/homeLatestStories";

const staticAnalyticsData = {
  subscribersMonthly: [
    { month: "2025-04-01", count: 319762 },
    { month: "2025-05-01", count: 340253 },
    { month: "2025-06-01", count: 419994 },
    { month: "2025-07-01", count: 625718 },
    { month: "2025-08-01", count: 1078698 },
    { month: "2025-09-01", count: 894573 },
    { month: "2025-10-01", count: 777328 },
    { month: "2025-11-01", count: 1126959 },
    { month: "2025-12-01", count: 1439330 },
    { month: "2026-01-01", count: 673828 },
    { month: "2026-02-01", count: 1585710 },
    { month: "2026-03-01", count: 1650596 },
  ],
  opensMonthly: [
    { month: "2025-04-01", count: 118560 },
    { month: "2025-05-01", count: 216744 },
    { month: "2025-06-01", count: 605956 },
    { month: "2025-07-01", count: 1077781 },
    { month: "2025-08-01", count: 1218307 },
    { month: "2025-09-01", count: 1446435 },
    { month: "2025-10-01", count: 1625856 },
    { month: "2025-11-01", count: 2355611 },
    { month: "2025-12-01", count: 3160605 },
    { month: "2026-01-01", count: 3893175 },
    { month: "2026-02-01", count: 4621892 },
    { month: "2026-03-01", count: 6105316 },
  ],
  adClickActivity: [
    { week: "Week 1", lastMonth: 4862, thisMonth: 4729 },
    { week: "Week 2", lastMonth: 4747, thisMonth: 3920 },
    { week: "Week 3", lastMonth: 7168, thisMonth: 6050 },
    { week: "Week 4", lastMonth: 3987, thisMonth: 2789 },
  ],
  lastCampaignOpenSummary: {
    totalOpens: 240123,
    formattedTotalOpens: "240K+",
  },
};

export default function Home() {
  const {
    subscribersMonthly = [],
    opensMonthly = [],
    adClickActivity = [],
  } = staticAnalyticsData;

  return (
    <>
      <Hero />
      <HomeNewsletterAdsGrow />
      <HomePopularNewsletters />
      <HomeWorldEngages
        subscribersMonthly={subscribersMonthly}
        opensMonthly={opensMonthly}
        adClickActivity={adClickActivity}
      />
      <HomeLovedByReaders />
      <HomeSocialconversations />
      <HomeLatestStories />
    </>
  );
}
