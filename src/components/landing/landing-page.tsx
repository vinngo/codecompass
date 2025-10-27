"use client";
import Hero from "./hero";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <Footer />
    </div>
  );
}
