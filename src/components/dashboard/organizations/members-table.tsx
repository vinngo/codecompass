"use client";

import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrganizationMember, User } from "@/app/types/supabase";
import { getOrgMembers } from "@/lib/services/orgService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/dashboard/dashboard-provider";

type MembersTableProps = {
  organizationId: string;
};

export function MembersTable({ organizationId }: MembersTableProps) {
  // Get userId from React Query cache via useAuth hook
  const { user } = useAuth();
  const userId = user?.id;

  const [ownerIds, setOwnerIds] = useState<Set<string | undefined>>(new Set());
  const { data, isLoading, error } = useQuery<OrganizationMember[]>({
    queryKey: ["members", organizationId],
    queryFn: async () => {
      const result = await getOrgMembers(organizationId);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });

  useEffect(() => {
    if (data) {
      const owners = data.filter((member) => member.role === "owner");
      setOwnerIds(new Set(owners.map((owner) => owner.user_id)));
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-muted-foreground">
          Loading members...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10">
        <div className="p-8 text-center text-destructive">
          Error: {error.message}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center text-muted-foreground">
          No members found in this organization.
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">Email</TableHead>
            <TableHead className="text-muted-foreground">Role</TableHead>
            <TableHead className="text-muted-foreground">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((member) => (
            <TableRow key={member.user_id}>
              <TableCell className="font-medium">{member.user_email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    member.role === "owner"
                      ? "bg-primary/10 text-primary ring-primary/30"
                      : "bg-secondary/50 text-secondary-foreground ring-secondary"
                  }`}
                >
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(member.joined_at)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  {ownerIds.has(userId) && member.user_id === userId ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={ownerIds.size <= 1}
                      className="mr-1"
                    >
                      Leave organization
                    </Button>
                  ) : member.role === "teammate" && ownerIds.has(userId) ? (
                    <>
                      <Button variant="outline" size="sm">
                        Manage role
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </>
                  ) : member.role === "teammate" &&
                    member.user_id === userId ? (
                    <Button variant="outline" size="sm" className="mr-1">
                      Leave organization
                    </Button>
                  ) : (
                    <> </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
