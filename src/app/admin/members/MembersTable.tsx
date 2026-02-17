"use client";

import { useState, useTransition } from "react";
import useSWR from "swr";
import { Plus, Trash2, UserCheck, UserX, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getMembershipTierLabel } from "@/lib/database.types";
import {
  type UserWithStatus,
  fetchUsers,
  deleteMember,
  toggleMemberActive,
  resendInvitation,
} from "@/lib/actions/members";
import { unwrap } from "@/lib/actions/action-result";
import { AddMemberDialog } from "./AddMemberDialog";
import { DeleteMemberDialog } from "./DeleteMemberDialog";

interface MembersTableProps {
  initialMembers: UserWithStatus[];
}

export function MembersTable({ initialMembers }: MembersTableProps) {
  const { data: members, mutate } = useSWR<UserWithStatus[]>(
    "admin-users",
    () => unwrap(fetchUsers()),
    { fallbackData: initialMembers }
  );

  const [isPending, startTransition] = useTransition();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserWithStatus | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteMember(deleteTarget.id);
      if (result.success) {
        toast.success("User removed");
        mutate();
      } else {
        toast.error(result.error.message);
      }
      setDeleteTarget(null);
    });
  };

  const handleToggleActive = (member: UserWithStatus) => {
    startTransition(async () => {
      const result = await toggleMemberActive(member.id, !member.is_active);
      if (result.success) {
        toast.success(
          member.is_active ? "User deactivated" : "User activated"
        );
        mutate();
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const handleResendInvitation = (member: UserWithStatus) => {
    startTransition(async () => {
      const result = await resendInvitation(member.id);
      if (result.success) {
        toast.success("Invitation email sent");
        mutate();
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const handleMemberAdded = () => {
    mutate();
    setAddDialogOpen(false);
  };

  const needsInvitation = (member: UserWithStatus) => !member.has_password;

  return (
    <>
      {/* Add User Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-accent text-surface hover:bg-accent-hover"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border border-border-accent-light overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-accent-light bg-surface-sunken">
              <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Tier
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Added
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members && members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border-accent-light/50 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    {member.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.role === "admin"
                          ? "bg-accent-20 text-accent"
                          : "bg-white/5 text-foreground-muted"
                      }`}
                    >
                      {member.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    {getMembershipTierLabel(member.membership_tier)}
                  </td>
                  <td className="px-4 py-3">
                    {needsInvitation(member) ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        Pending
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          member.is_active
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.is_active ? "bg-green-400" : "bg-red-400"
                          }`}
                        />
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-subtle">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {needsInvitation(member) && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleResendInvitation(member)}
                          disabled={isPending}
                          title="Resend invitation"
                          className="text-foreground-subtle hover:text-accent"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleToggleActive(member)}
                        disabled={isPending}
                        title={
                          member.is_active
                            ? "Deactivate user"
                            : "Activate user"
                        }
                        className="text-foreground-subtle hover:text-white"
                      >
                        {member.is_active ? (
                          <UserX className="w-3.5 h-3.5" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeleteTarget(member)}
                        disabled={isPending}
                        title="Delete user"
                        className="text-foreground-subtle hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-foreground-subtle"
                >
                  No users yet. Add your first user above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {members && members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-lg border border-border-accent-light bg-surface-section"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {member.name}
                    </p>
                    <span
                      className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        member.role === "admin"
                          ? "bg-accent-20 text-accent"
                          : "bg-white/5 text-foreground-subtle"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-muted truncate mt-0.5">
                    {member.email}
                  </p>
                </div>
                {needsInvitation(member) ? (
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">
                    Pending
                  </span>
                ) : (
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      member.is_active
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-accent-light/30">
                <div className="flex items-center gap-3 text-xs text-foreground-subtle">
                  <span>{getMembershipTierLabel(member.membership_tier)}</span>
                  <span>
                    {new Date(member.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {needsInvitation(member) && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleResendInvitation(member)}
                      disabled={isPending}
                      className="text-foreground-subtle hover:text-accent"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleToggleActive(member)}
                    disabled={isPending}
                    className="text-foreground-subtle hover:text-white"
                  >
                    {member.is_active ? (
                      <UserX className="w-3.5 h-3.5" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setDeleteTarget(member)}
                    disabled={isPending}
                    className="text-foreground-subtle hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-foreground-subtle py-12">
            No users yet. Add your first user above.
          </p>
        )}
      </div>

      {/* Dialogs */}
      <AddMemberDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleMemberAdded}
      />

      <DeleteMemberDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        memberName={deleteTarget?.name ?? ""}
        isPending={isPending}
      />
    </>
  );
}
