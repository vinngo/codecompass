"use client";

import { useQuery } from "@tanstack/react-query";
import { OrganizationMember } from "@/app/types/supabase";
import { getOrgMembers } from "@/lib/services/orgService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MembersTableProps = {
  organizationId: string;
};

export function MembersTable({ organizationId }: MembersTableProps) {
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
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="text-right">
                <span className="text-xs text-muted-foreground">
                  {/* Placeholder for future actions (remove, change role, etc.) */}
                  —
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
