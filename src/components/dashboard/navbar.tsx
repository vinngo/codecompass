import { Button } from "@/components/ui/button";

export function DashboardNavbar() {
  return (
    <header className="w-full border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary" />
          <span className="font-semibold text-foreground">
            Dashboard - Organizations
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Home
          </Button>
          <Button variant="default" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
}
