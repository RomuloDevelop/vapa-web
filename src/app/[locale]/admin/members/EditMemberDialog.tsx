"use client";

import { useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { updateMemberDetails, type UserWithStatus } from "@/lib/actions/members";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: UserWithStatus | null;
  onSuccess: () => void;
}

interface EditFormValues {
  name: string;
  role: "admin" | "member";
  membership_tier: string;
  is_active: boolean;
}

const inputClass =
  "w-full px-3 py-2 rounded-md bg-surface border text-white placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-border-accent-light focus:border-accent";

const readOnlyInputClass =
  "w-full px-3 py-2 rounded-md bg-surface-sunken border text-foreground-subtle text-sm border-border-accent-light cursor-not-allowed";

export function EditMemberDialog({
  open,
  onOpenChange,
  member,
  onSuccess,
}: EditMemberDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    defaultValues: {
      name: "",
      role: "member",
      membership_tier: "active",
      is_active: true,
    },
  });

  // Reset form values when the member changes
  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        role: member.role,
        membership_tier: member.membership_tier,
        is_active: member.is_active,
      });
    }
  }, [member, reset]);

  const onSubmit = (data: EditFormValues) => {
    if (!member) return;
    startTransition(async () => {
      const result = await updateMemberDetails(member.id, {
        name: data.name,
        role: data.role,
        membership_tier: data.membership_tier,
        is_active: data.is_active,
      });

      if (result.success) {
        toast.success("User updated");
        onSuccess();
      } else {
        toast.error(result.error.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && member) {
          reset({
            name: member.name,
            role: member.role,
            membership_tier: member.membership_tier,
            is_active: member.is_active,
          });
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="bg-surface-section border-border-accent-light">
        <DialogHeader>
          <DialogTitle className="text-white">Edit User</DialogTitle>
          <DialogDescription className="text-foreground-subtle">
            Update user details and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-name"
              className="text-sm font-medium text-foreground-muted"
            >
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Full name"
              className={errors.name ? inputClass.replace("border-border-accent-light focus:border-accent", "border-red-500 focus:border-red-500") : inputClass}
            />
            {errors.name && (
              <span className="text-xs text-red-400">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-email"
              className="text-sm font-medium text-foreground-muted"
            >
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={member?.email ?? ""}
              readOnly
              className={readOnlyInputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground-muted">
              Role
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground-muted">
              Membership Tier
            </label>
            <Controller
              name="membership_tier"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="edit-active"
              className="text-sm font-medium text-foreground-muted"
            >
              Active
            </label>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <button
                  id="edit-active"
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-section ${
                    field.value ? "bg-accent" : "bg-surface-elevated"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      field.value ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              )}
            />
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
