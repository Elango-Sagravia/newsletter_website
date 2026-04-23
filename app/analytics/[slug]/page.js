import Link from "next/link";
import { notFound } from "next/navigation";

import { ANALYTICS_CONFIG, ANALYTICS_SLUGS } from "../config";
import { getWebsiteAnalyticsData } from "@/lib/websiteAnalytics";
import WebsiteAnalytics from "@/components/analyticsPages/WebsiteAnalytics";
import AnalyticsComboList from "@/components/analyticsComboList/analyticsComboList";

export const revalidate = 43200;

export async function generateStaticParams() {
  return ANALYTICS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const config = ANALYTICS_CONFIG[slug];

  if (!config) return {};

  return {
    title: config.seo.title,
    description: `${config.seo.description}.`,
    alternates: {
      canonical: `/analytics/${slug}`,
    },
  };
}

export default async function AnalyticsPage({ params }) {
  const { slug } = await params;

  const config = ANALYTICS_CONFIG[slug];

  if (!config) {
    return notFound();
  }

  let analytics = {
    opensByMonth: [],
    subscribersByMonth: [],
    genderBreakdown: [],
    countryBreakdown: [],
    adClicksMonthly: [],
  };

  try {
    analytics = await getWebsiteAnalyticsData(config.websiteId);
  } catch (error) {
    console.error("[AnalyticsPage] error:", error);
  }

  const opensByMonth = analytics?.opensByMonth || [];
  const subscribersByMonth = analytics?.subscribersByMonth || [];
  const genderBreakdown = analytics?.genderBreakdown || [];
  const countryBreakdown = analytics?.countryBreakdown || [];
  const adClicksMonthly = analytics?.adClicksMonthly || [];

  return (
    <>
      <div className="hidden lg:block bg-[#FAFAFA] pb-[60px]">
        <div className="px-[33px]">
          <Link href="/">
            <div className="pt-[30px]">
              <img
                src="/logo.png"
                alt="Sagravia Logo"
                className="w-32 md:w-36 cursor-pointer"
              />
            </div>
          </Link>

          <div className="flex justify-between pt-[37px]">
            <div className="w-[40%]">
              <h1 className="text-[47px] font-[400] leading-normal font-[manrope] text-[#000]">
                Analytics overview
              </h1>
            </div>
            <div className="w-[60%] flex justify-end items-end">
              <AnalyticsComboList selected={slug} />
            </div>
          </div>

          <WebsiteAnalytics
            config={config}
            opensByMonth={opensByMonth}
            subscribersByMonth={subscribersByMonth}
            genderBreakdown={genderBreakdown}
            countryBreakdown={countryBreakdown}
            adClicksMonthly={adClicksMonthly}
          />
        </div>
      </div>

      <div className="block lg:hidden bg-[#FAFAFA] pt-[160px] pb-[70px]">
        <AnalyticsComboList selected={slug} />
        <WebsiteAnalytics
          config={config}
          opensByMonth={opensByMonth}
          subscribersByMonth={subscribersByMonth}
          genderBreakdown={genderBreakdown}
          countryBreakdown={countryBreakdown}
          adClicksMonthly={adClicksMonthly}
        />
      </div>
    </>
  );
}
