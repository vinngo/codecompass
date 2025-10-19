import { Button } from "@/components/ui/button";
import { NavContext } from "./navcontext";

export function DashboardNavbar() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="flex h-13 *:items-center justify-between px-5">
        <div className="flex items-center flex-row gap-5">
          {/*Replace this with our logo */}
          <div className="h-5 w-5 rounded bg-primary" />
          <div className="font-extralight text-lg text-input">/</div>
          <NavContext />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
}
