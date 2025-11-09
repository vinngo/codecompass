"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client"; // ✅ use this
import { useRouter, useParams } from "next/navigation";

export default function OrganizationSettings() {
  const [orgName, setOrgName] = useState("CodeCompass");
  const router = useRouter();
  const params = useParams();
  const orgId = params.id;
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
        .from("organizations")
        .update({ name: orgName })
        .eq("id", orgId)
        .select();

      if (error) throw error;
      console.log("✅ Updated organization:", data);

      router.push(`/dashboard/org/${orgId}`);
    } catch (err) {
      console.error("❌ Failed to update organization:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12">
      <h1 className="text-3xl font-bold">Organization Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter organization name"
            />
          </div>
          <Button onClick={handleSave}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
