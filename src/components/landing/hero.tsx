"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import NextLink from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 gap-4">
      <h1
        className="flex flex-col text-7xl font-medium items-center justify-center"
        style={{ textShadow: "0 0 7px currentColor" }}
      >
        <span className="block text-foreground">Navigate any codebase</span>
        <span className="text-accent">in minutes, not months</span>
      </h1>
      <p className="pt-2 text-foreground my-3 text-sm sm:mt-5 lg:mb-0 sm:text-base lg:text-lg text-center max-w-2xl">
        CodeCompass is <span className="font-semibold italic">the</span>{" "}
        <span className="text-accent font-semibold italic">open-source</span>{" "}
        AI-powered code navigation tool.
        <br className="hidden md:block" />
        Index your project to generate documentation and onboard your team using
        RAG powered chat.
      </p>
      <div className="flex flex-row gap-4">
        <Button asChild>
          <Link href="/auth/login">Get started</Link>
        </Button>
        <Button variant="outline">Our Features</Button>
      </div>
    </div>
  );
}
