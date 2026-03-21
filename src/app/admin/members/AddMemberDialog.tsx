"use client";

import { useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { addMemberSchema, type AddMemberFormValues } from "@/lib/schemas";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const inputClass =
  "w-full px-3 py-2 rounded-md bg-surface border text-foreground placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-border-accent-light focus:border-accent";

const errorInputClass =
  "w-full px-3 py-2 rounded-md bg-surface border text-foreground placeholder:text-foreground-faint text-sm focus:outline-none transition-colors border-red-500 focus:border-red-500";

export function AddMemberDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddMemberDialogProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "member",
      membership_tier: "active",
    },
  });

  const onSubmit = (data: AddMemberFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("name", data.name);
      formData.set("membership_tier", data.membership_tier);
      formData.set("role", data.role);

      const result = await addMember(formData);

      if (result.success) {
        toast.success("User added — invitation email sent");
        reset();
        onSuccess();
      } else {
        if (result.error.fields) {
          for (const [field, message] of Object.entries(result.error.fields)) {
            if (field in addMemberSchema.shape) {
              setError(field as keyof AddMemberFormValues, { message });
            }
          }
        }
        toast.error(result.error.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="bg-surface-section border-border-accent-light">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add User</DialogTitle>
          <DialogDescription className="text-foreground-subtle">
            Add a new user. They will receive an invitation email to set their
            password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              {...register("name")}
              placeholder="Full name"
              className={errors.name ? errorInputClass : inputClass}
            />
            {errors.name && (
              <span className="text-xs text-red-400">{errors.name.message}</span>
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
              {...register("email")}
              placeholder="user@example.com"
              className={errors.email ? errorInputClass : inputClass}
            />
            {errors.email && (
              <span className="text-xs text-red-400">{errors.email.message}</span>
            )}
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
                  <SelectTrigger className="bg-surface border-border-accent-light text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-section border-border-accent-light">
                    <SelectItem
                      value="member"
                      className="text-foreground-muted focus:bg-accent-20 focus:text-foreground"
                    >
                      Member
                    </SelectItem>
                    <SelectItem
                      value="admin"
                      className="text-foreground-muted focus:bg-accent-20 focus:text-foreground"
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
                  <SelectTrigger className="bg-surface border-border-accent-light text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-section border-border-accent-light">
                    {MEMBERSHIP_TIERS.map((t) => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="text-foreground-muted focus:bg-accent-20 focus:text-foreground"
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.membership_tier && (
              <span className="text-xs text-red-400">
                {errors.membership_tier.message}
              </span>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="text-foreground-muted hover:text-foreground"
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
