"use client";

import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Gitlab } from "@geist-ui/icons";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function LoginPage() {
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
    email?: string;
  }>({ type: "idle" });

  async function handleSubmit(formData: FormData) {
    setStatus({ type: "loading" });

    const result = await login(formData);

    if (result.success) {
      setStatus({
        type: "success",
        email: result.email,
        message: "Check your email for a magic link to sign in!",
      });
    } else {
      setStatus({
        type: "error",
        message: result.error || "Something went wrong. Please try again.",
      });
    }
  }

  async function signInWithGithub() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`, // 
      },
    });

    if (error) {
      console.error("Error signing in with GitHub:", error.message);
    } else if (data?.url) {
      // Redirect the user to GitHub's OAuth consent screen
      window.location.href = data.url;
    }
  }


  // Show login form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="font-semibold text-foreground text-2xl">
              Welcome back
            </h1>
            <h1 className="font-semibold text-primary text-xl">
              Sign in to your CodeCompass account
            </h1>
          </div>
          <form action={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-5">
              <Button type="button" variant="outline" onClick={signInWithGithub}>
                <div className="flex flex-row gap-3">
                  <Github />
                  <p>Continue with Github</p>
                </div>
              </Button>
              <Button type="button" variant="outline">
                <div className="flex flex-row gap-3">
                  <Gitlab />
                  <p>Continue with Gitlab</p>
                </div>
              </Button>
            </div>
            {/* divider */}
            <div className="border-b border-border"></div>
            {/* Email Input */}
            <div className="space-y-5">
              {status.type === "error" && (
                <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-3 text-sm">
                  {status.message}
                </div>
              )}
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm text-muted-foreground">Email</span>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address..."
                  required
                  disabled={status.type === "loading"}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={status.type === "loading"}
              >
                {status.type === "loading" ? "Sending..." : "Continue"}
              </Button>
            </div>
          </form>
          {status.type === "success" && (
            <div className="bg-accent/10 border border-accent text-accent rounded-md p-3 text-sm">
              {status.message}
            </div>
          )}
          {status.type === "error" && (
            <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-3 text-sm">
              {status.message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
