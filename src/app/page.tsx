import LandingPage from "@/components/landing/landing-page";
import Navbar from "@/components/landing/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect("/dashboard/organizations");
  }

  // Show landing page for unauthenticated users
  return (
    <>
      <Navbar />
      <LandingPage />
    </>
  );
}
