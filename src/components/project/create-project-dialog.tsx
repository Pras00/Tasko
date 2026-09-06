"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject } from "@/actions/project-actions"
import { toast } from "sonner"
import { Plus, Loader2, FolderKanban } from "lucide-react"

interface CreateProjectDialogProps {
  trigger?: React.ReactNode
}

export function CreateProjectDialog({ trigger }: CreateProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter a project name")
      return
    }

    try {
      setIsLoading(true)
      const res = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      })

      if (res.success && res.project) {
        toast.success(res.message)
        setName("")
        setDescription("")
        setOpen(false)
        router.push(`/projects/${res.project.id}`)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("An error occurred while creating the project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl shadow-sm shadow-indigo-500/20">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl">Create New Project</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Projects help organize your tasks, team members, and deadlines in one shared board.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="project-name" className="text-xs font-semibold">
                Project Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="e.g. Website Redesign 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl"
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-desc" className="text-xs font-semibold">
                Description (Optional)
              </Label>
              <textarea
                id="project-desc"
                placeholder="Briefly describe the purpose of this project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[90px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                maxLength={500}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Project</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
