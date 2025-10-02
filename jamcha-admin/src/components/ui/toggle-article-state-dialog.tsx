
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
  } from "./dialog";
  import { Button } from "./button";
  import { ReactNode } from "react";
  
  interface ToggleArticleStateDialogProps {
    open: boolean;
    title?: string;
    description?: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isActive: boolean;
  }
  
  export function ToggleArticleStateDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    isActive,
  }: ToggleArticleStateDialogProps) {
    return (
      <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={isActive ? "text-green-600" : "text-red-600"}>
              {title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            {description}
          </DialogDescription>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              {cancelText}
            </Button>
            <Button
              variant={isActive ? "default" : "destructive"}
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
