// app/advertise/page.js
import AdvertiseClient from "./AdvertiseClient";

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

export default function Advertise() {
  return <AdvertiseClient />;
}
