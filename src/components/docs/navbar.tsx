"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../ui/navigation-menu";

export default function Navbar() {
  return (
    <div className="container mx-auto border-b border-border">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/codecompass.png"
              alt="CodeCompass Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-foreground">
              CodeCompass{" "}
              {<span className="text-primary font-medium">DOCS</span>}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
