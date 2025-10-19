import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Gitlab } from "@geist-ui/icons";

export default function LoginPage() {
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
          <form action={login} className="space-y-4">
            <div className="flex flex-col space-y-5">
              <Button type="button" variant="outline">
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
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm text-muted-foreground">Email</span>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email address..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
