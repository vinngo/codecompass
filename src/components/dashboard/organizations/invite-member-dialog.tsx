"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, RefreshCw } from "lucide-react";

type InviteMemberDialogProps = {
  organizationId: string;
  organizationName: string;
  children: React.ReactNode;
};

export function InviteMemberDialog({
  organizationId,
  organizationName,
  children,
}: InviteMemberDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const generateInviteLink = async () => {
    setIsGenerating(true);

    // TODO: Call server action to create invite token
    // const result = await createInviteLink(organizationId);
    // if (result.success) {
    //   const link = `${window.location.origin}/invite/${organizationId}/${result.data.token}`;
    //   setInviteLink(link);
    //   setExpiresAt(result.data.expiresAt);
    // }

    // Placeholder implementation
    await new Promise((resolve) => setTimeout(resolve, 500));
    const token = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const link = `${window.location.origin}/invite/${organizationId}/${token}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    setInviteLink(link);
    setExpiresAt(expires.toISOString());
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 1) return "Expires in 1 day";
    if (diffInDays < 7) return `Expires in ${diffInDays} days`;
    return `Expires on ${date.toLocaleDateString()}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            Generate a one-time invite link for{" "}
            <span className="font-semibold text-foreground">
              {organizationName}
            </span>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-4 py-4">
          {!inviteLink ? (
            <div className="flex flex-col gap-3 items-center py-6">
              <p className="text-sm text-muted-foreground text-center">
                Click the button below to generate a secure, one-time use invite
                link.
              </p>
              <Button
                onClick={generateInviteLink}
                disabled={isGenerating}
                variant="default"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Invite Link"
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="invite-link"
                    className="text-sm font-medium text-foreground"
                  >
                    Invite Link
                  </label>
                  {expiresAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatExpiryDate(expiresAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="invite-link"
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 bg-muted font-mono text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">
                    This link can only be used <strong>once</strong> and will
                    expire in 7 days.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={generateInviteLink}
                    disabled={isGenerating}
                    className="w-fit text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Generate new link
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
