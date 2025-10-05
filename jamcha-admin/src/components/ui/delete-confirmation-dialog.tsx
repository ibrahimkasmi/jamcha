import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
import { Button } from './button';
import { ReactNode } from 'react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export function DeleteConfirmationDialog({
  open,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  children
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
