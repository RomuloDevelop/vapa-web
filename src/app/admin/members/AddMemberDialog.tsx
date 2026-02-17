"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEMBERSHIP_TIERS } from "@/lib/database.types";
import { addMember } from "@/lib/actions/members";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState("active");
  const [role, setRole] = useState("member");
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEmail("");
    setName("");
    setTier("active");
    setRole("member");
    setFieldErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("name", name);
      formData.set("membership_tier", tier);
      formData.set("role", role);

      const result = await addMember(formData);

      if (result.success) {
        toast.success("User added — invitation email sent");
        resetForm();
        onSuccess();
      } else {
        if (result.error.fields) {
          setFieldErrors(result.error.fields);
        }
        toast.error(result.error.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setFieldErrors({});
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="bg-surface-section border-border-accent-light">
        <DialogHeader>
          <DialogTitle className="text-white">Add User</DialogTitle>
          <DialogDescription className="text-foreground-subtle">
            Add a new user. They will receive an invitation email to set their
            password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="member-name"
              className="text-sm font-medium text-foreground-muted"
            >
              Name
            </label>
            <input
              id="member-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((prev) => {
                    const { name: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="Full name"
              required
              className={`w-full px-3 py-2 rounded-md bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors ${
                fieldErrors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-border-accent-light focus:border-accent"
              }`}
            />
            {fieldErrors.name && (
              <span className="text-xs text-red-400">{fieldErrors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="member-email"
              className="text-sm font-medium text-foreground-muted"
            >
              Email
            </label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => {
                    const { email: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="user@example.com"
              required
              className={`w-full px-3 py-2 rounded-md bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-border-accent-light focus:border-accent"
              }`}
            />
            {fieldErrors.email && (
              <span className="text-xs text-red-400">{fieldErrors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground-muted">
              Role
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-surface border-border-accent-light text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-section border-border-accent-light">
                <SelectItem
                  value="member"
                  className="text-foreground-muted focus:bg-accent-20 focus:text-white"
                >
                  Member
                </SelectItem>
                <SelectItem
                  value="admin"
                  className="text-foreground-muted focus:bg-accent-20 focus:text-white"
                >
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground-muted">
              Membership Tier
            </label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="bg-surface border-border-accent-light text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-section border-border-accent-light">
                {MEMBERSHIP_TIERS.map((t) => (
                  <SelectItem
                    key={t.value}
                    value={t.value}
                    className="text-foreground-muted focus:bg-accent-20 focus:text-white"
                  >
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="text-foreground-muted hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-accent text-surface hover:bg-accent-hover"
            >
              {isPending ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
