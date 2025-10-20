import { NewOrganizationForm } from "@/components/dashboard/organizations/new-organization-form";
import { NewProjectForm } from "@/components/dashboard/repos/new-repo-form";

type NewPageProps = {
  searchParams: Promise<{ org?: string }>;
};

export default async function NewPage({ searchParams }: NewPageProps) {
  const params = await searchParams;
  const orgId = params.org;

  // If org ID is present, show new project form
  if (orgId) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Create New Project
        </h1>
        <NewProjectForm orgId={orgId} />
      </div>
    );
  }

  // Otherwise, show new organization form
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <NewOrganizationForm />
    </div>
  );
}
