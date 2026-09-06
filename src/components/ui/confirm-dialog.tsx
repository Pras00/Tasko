"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: "destructive" | "default"
  icon?: "trash" | "warning"
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "destructive",
  icon = "trash",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive"

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 border-border/80 shadow-2xl bg-card">
        <div className="flex flex-col gap-4">
          {/* Visual Danger Icon Badge */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${
              isDestructive
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            {icon === "trash" ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2.5 pt-2 border-t border-border/40 bg-transparent -mx-6 -mb-6 p-6">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold h-9 px-4 border-border/70 hover:bg-accent cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`rounded-xl text-xs font-semibold h-9 px-4 gap-2 cursor-pointer transition-all ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/25 focus-visible:ring-rose-500"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {icon === "trash" && <Trash2 className="w-3.5 h-3.5" />}
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
