import Link from "next/link";
import { notFound } from "next/navigation";

import { ANALYTICS_CONFIG } from "../config";
import WebsiteAnalytics from "@/components/analyticsPages/WebsiteAnalytics";
import AnalyticsComboList from "@/components/analyticsComboList/analyticsComboList";

export const dynamic = "force-dynamic";

// meta data
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const config = ANALYTICS_CONFIG[slug];

  if (!config) {
    return {};
  }

  return {
    title: `${config.seo.title}`,
    description: `${config.seo.description}.`,
    alternates: {
      canonical: `/analytics/${slug}`,
    },
  };
}
// meta data

async function fetchAnalyticsForWebsite(websiteId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/analytics`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch /api/analytics", res.status);
    return null;
  }

  const data = await res.json();
  return data;
}

export default async function AnalyticsPage({ params }) {
  const { slug } = await params;

  const config = ANALYTICS_CONFIG[slug];

  if (!config) {
    return notFound();
  }

  const analytics = await fetchAnalyticsForWebsite(config.websiteId);

  const opensByMonth = analytics?.opensByMonth || [];
  const subscribersByMonth = analytics?.subscribersByMonth || [];
  const genderBreakdown = analytics?.genderBreakdown || [];
  const countryBreakdown = analytics?.countryBreakdown || [];
  const adClicksMonthly = analytics?.adClicksMonthly || [];

  return (
    <>
      {/* DESKTOP */}
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

      {/* MOBILE */}
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

// import Link from "next/link";
// import { notFound } from "next/navigation";

// import { ANALYTICS_CONFIG, ANALYTICS_SLUGS } from "../config";
// import WebsiteAnalytics from "@/components/analyticsPages/WebsiteAnalytics";
// import AnalyticsComboList from "@/components/analyticsComboList/analyticsComboList";

// export const revalidate = 43200; // 43200 seconds = 12 hours
// export async function generateStaticParams() {
//   return ANALYTICS_SLUGS.map((slug) => ({ slug }));
// }

// // meta data
// export async function generateMetadata({ params }) {
//   const { slug } = await params; // ✅ FIX

//   const config = ANALYTICS_CONFIG[slug];

//   if (!config) {
//     return {};
//   }

//   return {
//     title: `${config.seo.title}`,
//     description: `${config.seo.description}.`,
//     alternates: {
//       canonical: `/analytics/${slug}`,
//     },
//   };
// }
// // meta data

// async function fetchAnalyticsForWebsite(websiteId) {
//   const res = await fetch(
//     `${
//       process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//     }/api/analytics`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ websiteId }),
//       // `next` options don’t really do anything on POST, but harmless
//     }
//   );

//   if (!res.ok) {
//     console.error("Failed to fetch /api/analytics", res.status);
//     return null;
//   }

//   const data = await res.json(); // ✅ unwrap JSON here
//   return data;
// }

// export default async function AnalyticsPage({ params }) {
//   // 🔑 THIS IS THE IMPORTANT CHANGE
//   const { slug } = await params; // instead of: const slug = params.slug;

//   const config = ANALYTICS_CONFIG[slug];

//   if (!config) {
//     return notFound();
//   }

//   const analytics = await fetchAnalyticsForWebsite(config.websiteId);

//   const opensByMonth = analytics?.opensByMonth || [];
//   const subscribersByMonth = analytics?.subscribersByMonth || [];
//   const genderBreakdown = analytics?.genderBreakdown || [];
//   const countryBreakdown = analytics?.countryBreakdown || [];
//   const adClicksMonthly = analytics?.adClicksMonthly || [];

//   return (
//     <>
//       {/* DESKTOP */}
//       <div className="hidden lg:block bg-[#FAFAFA] pb-[60px]">
//         <div className="px-[33px]">
//           <Link href="/">
//             <div className="pt-[30px]">
//               <img
//                 src="/logo.png"
//                 alt="Sagravia Logo"
//                 className="w-32 md:w-36 cursor-pointer"
//               />
//             </div>
//           </Link>

//           <div className="flex justify-between pt-[37px]">
//             <div className="w-[40%]">
//               <h1 className="text-[47px] font-[400] leading-normal font-[manrope] text-[#000]">
//                 Analytics overview
//               </h1>
//             </div>
//             <div className="w-[60%] flex justify-end items-end">
//               <AnalyticsComboList selected={slug} />
//             </div>
//           </div>

//           <WebsiteAnalytics
//             config={config}
//             opensByMonth={opensByMonth}
//             subscribersByMonth={subscribersByMonth}
//             genderBreakdown={genderBreakdown}
//             countryBreakdown={countryBreakdown}
//             adClicksMonthly={adClicksMonthly}
//           />
//         </div>
//       </div>

//       {/* MOBILE */}
//       <div className="block lg:hidden bg-[#FAFAFA] pt-[160px] pb-[70px]">
//         <AnalyticsComboList selected={slug} />
//         <WebsiteAnalytics
//           config={config}
//           opensByMonth={opensByMonth}
//           subscribersByMonth={subscribersByMonth}
//           genderBreakdown={genderBreakdown}
//           countryBreakdown={countryBreakdown}
//           adClicksMonthly={adClicksMonthly}
//         />
//       </div>
//     </>
//   );
// }
