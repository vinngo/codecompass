"use client";
import Hero from "./hero";
import CTA from "./cta";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Hero />
            <CTA />
        </div>
    );
}
