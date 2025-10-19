import { Button } from "@/components/ui/button";

export default function OrganizationsPage() {
  return (
    <div className="container py-8 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Organizations
        </h1>
        <Button variant="default" size="default">
          Create Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Organization Card 1 */}
        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="aspect-square bg-muted rounded-md mb-4"></div>
          <h3 className="font-medium text-card-foreground">Organization 1</h3>
        </div>

        {/* Organization Card 2 */}
        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="aspect-square bg-muted rounded-md mb-4"></div>
          <h3 className="font-medium text-card-foreground">Organization 2</h3>
        </div>

        {/* Organization Card 3 */}
        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
          <div className="aspect-square bg-muted rounded-md mb-4"></div>
          <h3 className="font-medium text-card-foreground">Organization 3</h3>
        </div>
      </div>
    </div>
  );
}
