import "./globals.css";
import Navbar from "../components/navbar/navbar";
import FooterWrapper from "../components/footerWrapper/footerWrapper";
import ChatraProvider from "../components/chatraProvider/chatraProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.houseofsummary.com/#website",
  name: "House of Summary",
  description: "Verified global news, summarized clearly and concisely.",
  url: "https://www.houseofsummary.com",
  publisher: {
    "@id": "https://www.houseofsummary.com/#organization",
  },
};

export const metadata = {
  metadataBase: new URL("https://www.houseofsummary.com/"),

  title: {
    default: "House of Summary | Verified News, Summarized",
    template: "%s | House of Summary",
  },

  description:
    "Two friends on opposite sides of the world went door to door selling magazines in their neighbourhood. Two decades later House of Summary is born.",

  openGraph: {
    title: "House of Summary | Verified News, Summarized",
    description:
      "Two friends on opposite sides of the world went door to door selling magazines in their neighbourhood. Two decades later House of Summary is born.",
    url: "https://www.houseofsummary.com/",
    siteName: "House of Summary",
    images: [
      {
        url: "https://www.houseofsummary.com/og/og.png",
        width: 1200,
        height: 630,
        alt: "House of Summary – Verified News",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Summary | Verified News, Summarized",
    description:
      "Get the latest, verified news summaries from House of Summary.",
    images: ["https://www.houseofsummary.com/og/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.houseofsummary.com/#organization",
  name: "House of Summary",
  url: "https://www.houseofsummary.com/",
  logo: "https://www.houseofsummary.com/logo.png",
  email: "contact@houseofsummary.com",
  telephone: "+1-218-500-0099",
  address: {
    "@type": "PostalAddress",
    streetAddress: "30 N Gould St, Ste N",
    addressLocality: "Sheridan",
    addressRegion: "WY",
    postalCode: "82801",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-218-500-0099",
    contactType: "customer support",
    email: "contact@houseofsummary.com",
    availableLanguage: "English",
  },
  //Replace with your real social URLs. This increases Google trust → better sitelinks.

  sameAs: [
    "https://www.threads.com/@houseofsummary",
    "https://www.facebook.com/Houseofsummary/",
    "https://www.instagram.com/houseofsummary/",
    "https://x.com/Houseofsummary",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="9eqrF35DPBCpUmWcXWYJL31OjFXXVwBd_H6crG8wmvw"
        />

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          // strategy="afterInteractive"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* WebSite Schema (IMPORTANT for Google site name) */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KD3HTBFJ');
            `,
          }}
        />
        <Script
          id="beehiiv-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (f, b, e, h, i, v) {
                if (f.bhpx) return;
                i = f.bhpx = function () {
                  i.callMethod
                    ? i.callMethod.apply(i, arguments)
                    : i.queue.push(arguments)
                };
                if (!f._bhpx) f._bhpx = i;
                i.push = i;
                i.loaded = !0;
                i.version = '1.0';
                i.queue = [];

                v = b.createElement(e);
                v.async = !0;
                v.type = 'module';
                v.src = 'https://beehiiv-adnetwork-production.s3.amazonaws.com/pixel-v2.js';
                h = b.getElementsByTagName(e)[0];
                h.parentNode.insertBefore(v, h);
              }(window, document, 'script');

              bhpx('init', 'f6deff1c-2645-4189-98b9-6660caae7d40', {
                trackClientNavigation: true,
                debug: false
              });

              bhpx('track', 'pageview');
            `,
          }}
        />
      </head>

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KD3HTBFJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ChatraProvider />
        <Navbar />
        {children}
        <FooterWrapper />
      </body>

      <GoogleAnalytics gaId="G-8LHP119MT9" />
    </html>
  );
}
