import { Button } from "@/components/ui/button";
import { NavContext } from "./navcontext";
import Image from "next/image";
import { signOut } from "@/app/(auth)/client";

export function DashboardNavbar() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="flex h-13 *:items-center justify-between px-5">
        <div className="flex items-center flex-row gap-5">
          {/*Replace this with our logo */}
          <Image
            src="/codecompass.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <div className="font-extralight text-lg text-input">/</div>
          <NavContext />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
          <Button variant="default" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
}
