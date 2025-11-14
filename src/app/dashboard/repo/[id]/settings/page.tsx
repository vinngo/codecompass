"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client"; // ✅ use this
import { useRouter, useParams } from "next/navigation";

export default function RepoSettings() {
  const [repoName, setRepoName] = useState("");
  const router = useRouter();
  const params = useParams();
  const repoId = params.id;
  const supabase = createClient(); // ✅ reads cookies automatically

  const handleSave = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated", userError);
        return;
      }

      const { data, error } = await supabase
        .from("repositories")
        .update({ name: repoName })
        .eq("id", repoId)
        .select();

      if (error) throw error;
      console.log("✅ Updated repo:", data);

      router.push(`/dashboard/repo/${repoId}`);
    } catch (err) {
      console.error("❌ Failed to update repo:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated", userError);
        return;
      }

      // Optional: confirmation guard
      const confirmDelete = confirm(
        "Are you sure you want to delete this repository? This cannot be undone."
      );
      if (!confirmDelete) return;

      // ⭐ Fetch the org_id for this repo BEFORE deleting it
      const { data: repo, error: repoError } = await supabase
        .from("repositories")
        .select("organization_id")
        .eq("id", repoId)
        .single();

      const orgId = repo?.organization_id;

      const { error } = await supabase
        .from("repositories")
        .delete()
        .eq("id", repoId);

      if (error) throw error;

      console.log("🗑️ Repository deleted");
      router.push(`/dashboard/org/${orgId}`); // Redirect wherever you want
    } catch (err) {
      console.error("❌ Failed to delete repository:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12">
      <h1 className="text-3xl font-bold">Repository Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Repository Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repoName">Repository Name</Label>
            <Input
              id="repoName"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Enter repository name"
            />
          </div>
          <Button onClick={handleSave}>Save</Button>
        </CardContent>
      </Card>
      <div className="pt-2 max-w-2x1 mx-auto">
        <Button variant="destructive" onClick={handleDelete} className="mt-2">
          Delete Repository
        </Button>
      </div>
    </div>
  );
}
