import { Button } from "@/components/ui/button";
import { Plus } from "@geist-ui/icons";
import { OrganizationButton } from "@/components/dashboard/organizations/card";

export default function OrganizationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-foreground">Your Organizations</h1>
        <Button variant="default" size="sm">
          <div className="flex items-center gap-1">
            <Plus />
            <span>New organization</span>
          </div>
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <OrganizationButton />
        <OrganizationButton />
        <OrganizationButton />
        <OrganizationButton />
        <OrganizationButton />
        <OrganizationButton />
      </div>
    </div>
  );
}
