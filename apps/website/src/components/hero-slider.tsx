"use client";
import EmblaCarousel from "./carousel";

const SLIDES = [
  {
    heading: "Vastly is: Wave",
    description:
      "Wave is a low-code application platform that empowers engineers to build better digital products, applications, and experiences without the time, cost, and risk associated with large-scale digital transformation.",
  },
  {
    heading: "Vastly is: Marketplace",
    description:
      "Elevate your brand with a customizable Business Dashboard, offering a tailored blend of top-tier small business tools and services that seamlessly integrate into your existing product lineup. ",
  },
  {
    heading: "Vastly is: Payments",
    description:
      "Simple, secure and reliable payment processing along with the industry's most innovatve payment technology, all coupled with the software features you know and love.",
  },
];

export default function HeroSlider() {
  return <EmblaCarousel slides={SLIDES} />;
}
