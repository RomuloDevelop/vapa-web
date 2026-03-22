"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  eventName: string;
  isPending: boolean;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  onConfirm,
  eventName,
  isPending,
}: DeleteEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-section border-border-accent-light text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Event</DialogTitle>
          <DialogDescription className="text-foreground-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-white">{eventName}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-foreground-muted hover:bg-accent-10 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
