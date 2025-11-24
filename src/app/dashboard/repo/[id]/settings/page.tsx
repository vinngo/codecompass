"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import {
  updateRepoSettings,
  deleteRepo,
  getRepoWithStatus,
} from "@/lib/services/repoService";
import { NavbarContextSetter } from "@/components/dashboard/navbar-context-setter";
import { createClient } from "@/utils/supabase/client";
import type { Repo } from "@/app/types/supabase";
import { Separator } from "@/components/ui/separator";

export default function RepoSettings() {
  const [repoName, setRepoName] = useState("");
  const [repo, setRepo] = useState<Repo | null>(null);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const repoId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    const loadRepo = async () => {
      setIsLoading(true);
      const result = await getRepoWithStatus(repoId);

      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setRepo(result.data);
      setRepoName(result.data.name);

      // Fetch organization name for breadcrumbs
      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", result.data.organization_id)
        .single();

      if (org) {
        setOrgName(org.name);
      }

      setIsLoading(false);
    };

    loadRepo();
  }, [repoId, supabase]);

  const handleSave = async () => {
    if (!repoName.trim()) {
      setError("Repository name cannot be empty");
      return;
    }

    setIsSaving(true);
    setError("");

    const result = await updateRepoSettings(repoId, { name: repoName });

    if (!result.success) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    router.push(`/dashboard/repo/${repoId}`);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this repository? This cannot be undone.",
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    setError("");

    const result = await deleteRepo(repoId);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    router.push(`/dashboard/org/${result.data.organizationId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-12">
        <h1 className="text-3xl font-bold">Repository Settings</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12">
      {repo && (
        <NavbarContextSetter
          breadcrumbs={[
            { label: "Organizations", href: "/dashboard/organizations" },
            {
              label: orgName || "Organization",
              href: `/dashboard/org/${repo.organization_id}`,
            },
            { label: repo.name, href: `/dashboard/repo/${repo.id}` },
            { label: "Settings" },
          ]}
        />
      )}
      <h1 className="text-3xl font-bold">Repository Settings</h1>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Repository Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="repoName">Repository Name</Label>
              <Separator />
            </div>
            <Input
              id="repoName"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Enter repository name"
              disabled={isSaving}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="repoName">Delete Repository</Label>
              <Separator />
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Repository"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
