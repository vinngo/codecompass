import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard/organizations";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const provider = data.session.user.app_metadata.provider;
      const providerToken = data.session.provider_token;

      console.log(provider);
      console.log(providerToken);

      if (
        provider &&
        providerToken &&
        (provider === "github" || provider === "gitlab")
      ) {
        try {
          // Check if token already exists for this user+provider
          const { data: existingToken } = await supabase
            .from("git_provider_tokens")
            .select("id")
            .eq("user_id", data.session.user.id)
            .eq("provider", provider)
            .maybeSingle();

          if (existingToken) {
            // Update existing token
            const { error: updateError } = await supabase
              .from("git_provider_tokens")
              .update({
                access_token: providerToken,
                token_type: "bearer",
                scope: null,
              })
              .eq("id", existingToken.id);

            if (updateError) {
              console.error(`Failed to update ${provider} token:`, updateError);
            }
          } else {
            // Insert new token
            const { error: insertError } = await supabase
              .from("git_provider_tokens")
              .insert({
                user_id: data.session.user.id,
                provider: provider,
                access_token: providerToken,
                token_type: "bearer",
                scope: null,
              });

            if (insertError) {
              console.error(`Failed to insert ${provider} token:`, insertError);
            }
          }
        } catch (error) {
          console.error(`Failed to store ${provider} token:`, error);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/error`);
}
