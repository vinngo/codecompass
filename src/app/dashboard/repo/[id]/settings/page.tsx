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

export default function RepoSettings() {
  const [repoName, setRepoName] = useState("");
  const [repo, setRepo] = useState<Repo | null>(null);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
      setRepoUrl(result.data.repo_url || "");

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

    const settings: { name: string; repo_url?: string; file?: File } = {
      name: repoName,
    };

    // Add GitHub URL if changed
    if (repo?.provider === "github" && repoUrl && repoUrl !== repo.repo_url) {
      settings.repo_url = repoUrl;
    }

    // Add file if uploaded
    if (repo?.provider === "local" && uploadedFile) {
      settings.file = uploadedFile;
    }

    const result = await updateRepoSettings(repoId, settings);

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
    <div className="max-w-3xl mx-auto space-y-6 py-8 px-4">
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

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Repository Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your repository configuration and source files
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Repository Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Repository Name */}
          <div className="space-y-2">
            <Label htmlFor="repoName" className="text-sm font-medium">
              Repository Name
            </Label>
            <Input
              id="repoName"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Enter repository name"
              disabled={isSaving}
              className="h-10"
            />
          </div>

          {/* GitHub Repository URL */}
          {repo?.provider === "github" && (
            <div className="space-y-2">
              <Label htmlFor="repoUrl" className="text-sm font-medium">
                Repository URL
              </Label>
              <Input
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                disabled={isSaving}
                className="h-10 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                To see changes, you must manually request indexing after this
                change.
              </p>
            </div>
          )}

          {/* Local Repository File Upload */}
          {repo?.provider === "local" && (
            <div className="space-y-2">
              <Label htmlFor="repoFile" className="text-sm font-medium">
                Repository File
              </Label>
              <Input
                id="repoFile"
                type="file"
                accept=".zip,application/zip"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                disabled={isSaving}
                className="cursor-pointer file:cursor-pointer file:border file:border-input file:bg-background file:hover:bg-accent file:px-4 file:py-1.5 file:rounded-md file:mr-3 file:transition-colors file:text-sm"
              />
              {uploadedFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {uploadedFile.name} (
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Uploading a new .zip file will trigger re-indexing.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Delete Repository</Label>
            <p className="text-sm text-muted-foreground">
              Once you delete a repository, there is no going back. Please be
              certain.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? "Deleting..." : "Delete Repository"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
