// app/advertise/page.js
import HomeClient from "./HomeClient";

export const metadata = {
  title: "House of Summary | Verified News, Summarized",
  description:
    "Two friends on opposite sides of the world went door to door selling magazines in their neighbourhood. Two decades later House of Summary is born.",
  alternates: {
    canonical: "https://www.houseofsummary.com/",
  },
};

export default function Advertise() {
  return <HomeClient />;
}
