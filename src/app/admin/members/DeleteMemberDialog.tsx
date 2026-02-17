"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  memberName: string;
  isPending: boolean;
}

export function DeleteMemberDialog({
  open,
  onOpenChange,
  onConfirm,
  memberName,
  isPending,
}: DeleteMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-section border-border-accent-light">
        <DialogHeader>
          <DialogTitle className="text-white">Remove Member</DialogTitle>
          <DialogDescription className="text-foreground-subtle">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground-muted">
              {memberName}
            </span>
            ? They will no longer be able to access exclusive content.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-foreground-muted hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
