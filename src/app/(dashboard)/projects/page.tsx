import Link from "next/link"
import { getProjects } from "@/actions/project-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateProjectDialog } from "@/components/project/create-project-dialog"
import { FolderKanban, Users, CheckCircle2, ArrowUpRight } from "lucide-react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const projects = await getProjects()

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspaces and organize tasks across teams.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const isOwner = project.ownerId === session.user?.id

            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="rounded-3xl border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 h-full flex flex-col justify-between p-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                          isOwner
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {isOwner ? "Owner" : "Member"}
                      </Badge>
                    </div>

                    <CardTitle className="text-base font-bold mt-3.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                      <span className="truncate">{project.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all shrink-0" />
                    </CardTitle>

                    {project.description && (
                      <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                        <span>Progress</span>
                        <span>{project.progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{project.membersCount} members</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {project.completedTasksCount}/{project.tasksCount} tasks
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border/70 p-12 text-center bg-card/30 flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-3">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Projects Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5">
            You don&apos;t belong to any project yet. Create your first project workspace to start managing tasks with your team.
          </p>
          <CreateProjectDialog />
        </div>
      )}
    </div>
  )
}
