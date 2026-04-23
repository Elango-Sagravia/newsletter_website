"use client";

import Hero from "@/components/hero/hero";
import HomeNewsletterAdsGrow from "../components/homeNewsletterAdsGrow/homeNewsletterAdsGrow";
import HomePopularNewsletters from "../components/homePopularNewsletters/homePopularNewsletters";
import HomeWorldEngages from "../components/homeWorldEngages/homeWorldEngages";
import HomeLovedByReaders from "../components/homeLovedByReaders/homeLovedByReaders";
import HomeSocialconversations from "../components/homeSocialConversations/homeSocialConversations";
import HomeLatestStories from "../components/homeLatestStories/homeLatestStories";

export default function HomeClient({ analyticsData }) {
  const {
    subscribersMonthly = [],
    opensMonthly = [],
    adClickActivity = [],
  } = analyticsData || {};

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
