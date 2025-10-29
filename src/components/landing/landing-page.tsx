"use client";
import dynamic from "next/dynamic";
import Hero from "./hero";

const Footer = dynamic(() => import("./footer"));

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <Footer />
    </div>
  );
}
