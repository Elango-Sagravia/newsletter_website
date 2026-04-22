"use client";

import { AccountReached } from "../../components/advertiseComponents/analyticsCharts/chartAccountReached/chartAccountReached";
import { ViewsCountry } from "../../components/advertiseComponents/analyticsCharts/chartViewsByCountry/chartViewsByCountry";
import { ActiveUsers } from "../../components/advertiseComponents/analyticsCharts/chartActiveUsers/chartActiveUsers";
import { Statistics } from "../../components/advertiseComponents/analyticsCharts/chartStatistics/chartStatistics";
import { SignInUps } from "../../components/advertiseComponents/analyticsCharts/chartSignUps/chartSignUps";
import HeadingWithUnderline from "../../components/advertiseComponents/headingWithUnderline/headingwithUnderline";

import AdvertisePageMobileVersion from "../../components/advertisePageMobileVersion/advertisePageMobileVersion";
import AdvertiseAdBlocker from "../../components/advertiseAdBlocker/advertiseAdBlocker";
import AdvertiseNewFaq from "../../components/advertiseNewFaq/advertiseNewFaq";
import Link from "next/link";
import CustomizedHoverButton from "../../components/customizedHoverButton/customizedHoverButton";
import AdvertiseMotionText from "../../components/advertiseMotionText/advertiseMotionText";
import Script from "next/script";

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

export default function AdvertiseClient() {
  const {
    subscribersMonthly = [],
    opensByCountry = [],
    opensMonthly = [],
    opensByGender = [],
    adClickActivity = [],
    lastCampaignOpenSummary = {},
  } = staticAnalyticsData;

  const videos = [
    { video: "/advertise/v-1.mp4", id: "video1", height: "h-[694px]" },
    { video: "/advertise/v-2.mp4", id: "video2", height: "h-[644px]" },
    {
      video: "/advertise/v-3.mp4",
      id: "video3",
      height: "h-[781px]",
      moveUp: "mt-[-80px]",
    },
    {
      video: "/advertise/v-4.mp4",
      id: "video4",
      height: "h-[881px]",
      moveUp: "mt-[-120px]",
    },
  ];

  return (
    <>
      <Script id="rb2b-script" strategy="afterInteractive">
        {`
          !function(key) {
            if (window.reb2b) return;
            window.reb2b = {loaded: true};
            var s = document.createElement("script");
            s.async = true;
            s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
            document.getElementsByTagName("script")[0].parentNode.insertBefore(
              s,
              document.getElementsByTagName("script")[0]
            );
          }("0NW1GHZ25404");
        `}
      </Script>

      {/* hero section */}
      <div className="bg-[#FAFAFA] hidden lg:block pt-[38px]">
        <div className=" relative md:px-28">
          <div className="lg:pt-20 mx-auto">
            <div className="text-[#01261E]">
              <h1
                className="text-[80px] lg:w-[50%]  leading-[94%]"
                style={{ textShadow: "0px 4px 4px rgba(31, 25, 25, 0.00)" }}
              >
                {lastCampaignOpenSummary?.formattedTotalOpens} people would have
                seen your brand yesterday
              </h1>
              <p className="text-[20px] py-4 w-[30%] sm:w-[30%]">
                Make your brand part of their morning ritual. Not ignored ad
                inventory.
              </p>
              <div>
                <Link href="/contact">
                  <button className="flex px-[18px] py-[7px] bg-[#01261E] text-[#FAFAFA] text-[14px] font-[600] rounded-full hover:bg-[#0B4337]">
                    Advertise now
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative w-full mt-10">
            <div className="flex justify-center relative">
              <div className="flex space-x-4 items-end relative z-0 w-full">
                {videos.map((video) => (
                  <video
                    key={video.id}
                    src={video.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`object-cover w-[24%] max-w-[40%] ${
                      video.height
                    } ${video.moveUp || ""}`}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-4 left-[49.7%] -translate-x-1/2 z-20 text-center">
              <h2 className="font-[700] sm:text-[10vw] lg:text-[11.4vw] 2xl:text-[11.4vw] [1650px]:text-[13vw] [1800px]:text-[13vw] leading-[94%] tracking-[-1.6px] whitespace-nowrap">
                <span className="text-white">
                  <span className="lg:text-[14.2vw]">1</span>M+{" "}
                </span>
                <span className="text-[#01261E]">Subscribers</span>
              </h2>
            </div>
          </div>

          <div className="px-28 absolute -bottom-1 left-0 w-full h-[35vh] bg-gradient-to-t from-[#FAFAFA] to-transparent z-10"></div>
        </div>
      </div>

      {/* combined analytics */}
      <div className="bg-[#FAFAFA] relative hidden lg:block pt-20">
        <div className="px-4 sm:px-10 xl:px-28 2xl:px-28 pt-16 pb-10">
          <HeadingWithUnderline text="Combined Analytics" />
        </div>

        <div className="">
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 w-full md:py-4">
            <div className="w-full md:w-[45%]">
              <AccountReached
                subscribersMonthly={subscribersMonthly}
                isLoading={false}
              />
            </div>
            <div className="w-full md:w-[35%]">
              <ViewsCountry opensByCountry={opensByCountry} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 w-full md:py-4">
            <div className="w-full md:w-[35%]">
              <Statistics opensByGender={opensByGender} />
            </div>
            <div className="w-full md:w-[45%]">
              <ActiveUsers opensMonthly={opensMonthly} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 w-full md:py-4">
            <div className="w-full md:w-[45%]">
              <SignInUps adClickActivity={adClickActivity} />
            </div>
            <div className="w-full md:w-[35%]">
              <div
                className="h-[365px] rounded-[20px] shadow-[0px_4px_37px_0px_rgba(0,0,0,0.05)]"
                style={{
                  background:
                    "conic-gradient(from 142deg at 60.52% 63.72%, var(--Green-Main, #01261E) 0deg, #116150 360deg)",
                }}
              >
                <div className="md:flex md:flex-col justify-between md:p-10 h-full">
                  <div className="flex-grow">
                    <p className="text-[#FAFAFA] max-w-[335px] text-[20px]">
                      This is where precision meets perspective. Explore
                      detailed analytics for every newsletter to see how
                      influence, attention, and conversion intertwine across our
                      newsletter portfolio.
                    </p>
                  </div>
                  <div>
                    <CustomizedHoverButton
                      href="/analytics"
                      label="See analytics"
                      fontSize="14px"
                      fontWeight="600"
                      width="fit"
                      height="37px"
                      borderColor="#DAEBE8"
                      hoverBgColor="#DAEBE8"
                      hoverText="black"
                      textColor="#DAEBE8"
                      padding="px-[24px] py-[9px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* text with video section */}
      <div className="bg-[#FAFAFA] hidden lg:block">
        <div className="px-4 sm:px-10 xl:px-28 2xl:px-28 py-10">
          <HeadingWithUnderline text="What your ads will look like" />
        </div>

        <div className="w-full h-[962px] relative overflow-hidden">
          <div className="w-full h-full">
            <video
              key="advertise-video"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="/advertise/advertise-page-video.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        <div className="flex my-0 flex-col items-center justify-center text-center pt-10 pb-40">
          <h2
            className="text-[80px] font-[400] leading-[1]"
            style={{ fontFamily: "GT Super Ds Trial" }}
          >
            The most valuable real
            <br /> estate is the inbox
          </h2>

          <div className="w-[537px] mx-auto pt-[30px] ">
            <p className="text-[20px] font-[400] leading-[1.5] ">
              The inbox gives your brand a direct path to the reader. No
              algorithms, no ad blockers, no visual clutter. Just undivided
              attention.
            </p>
          </div>

          <AdvertiseMotionText />
        </div>
      </div>

      <div className="hidden lg:block">
        <AdvertiseAdBlocker />
      </div>

      <AdvertiseNewFaq />

      <div className="block lg:hidden bg-[#FAFAFA] pt-[100px] pb-[10px]">
        <AdvertisePageMobileVersion
          subscribersMonthly={subscribersMonthly}
          isLoading={false}
          opensByCountry={opensByCountry}
          opensByGender={opensByGender}
          opensMonthly={opensMonthly}
          adClickActivity={adClickActivity}
          formattedTotalOpens={lastCampaignOpenSummary?.formattedTotalOpens}
        />
      </div>
    </>
  );
}
