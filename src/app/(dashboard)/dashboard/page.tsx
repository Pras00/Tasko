import Link from "next/link"
import Image from "next/image"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDashboardMetrics } from "@/actions/dashboard-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateProjectDialog } from "@/components/project/create-project-dialog"
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Flame,
  ArrowUpRight,
  Kanban,
  Rocket,
  Layers,
} from "lucide-react"
import { TASK_PRIORITIES } from "@/lib/constants"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const metrics = await getDashboardMetrics()
  if (!metrics) {
    redirect("/login")
  }

  const userName = session.user.name ? session.user.name.split(" ")[0] : "there"

  // Calculate percentages for workflow distribution
  const total = metrics.totalTasks > 0 ? metrics.totalTasks : 1
  const todoPct = Math.round((metrics.todoTasks / total) * 100)
  const inProgressPct = Math.round((metrics.inProgressTasks / total) * 100)
  const inReviewPct = Math.round((metrics.inReviewTasks / total) * 100)
  const donePct = Math.round((metrics.completedTasks / total) * 100)

  return (
    <div className="space-y-8 pb-10">
      {/* Enhanced Hero Banner with 3D Illustration */}
      <div className="relative rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-600/10 via-violet-600/10 to-amber-500/10 p-6 sm:p-8 lg:p-10 backdrop-blur-md overflow-hidden shadow-lg shadow-indigo-500/5">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl -z-10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Active Sprint • Joyful Productivity</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                {userName}!
              </span>{" "}
              🚀
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              You have <strong className="text-foreground">{metrics.inProgressTasks} tasks</strong> in progress and{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">{metrics.completedTasks} tasks</strong> shipped across {metrics.totalProjects} project boards.
              {metrics.overdueTasksCount > 0 && (
                <span className="block mt-1 text-rose-500 font-semibold text-xs sm:text-sm">
                  ⚠️ Heads up: {metrics.overdueTasksCount} task requires your attention.
                </span>
              )}
            </p>

            {/* Quick Actions Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <CreateProjectDialog />
              <Link href="/projects">
                <Button
                  variant="outline"
                  className="rounded-xl border-border/80 bg-background/80 hover:bg-accent text-xs font-semibold gap-1.5 shadow-xs"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Browse Projects</span>
                </Button>
              </Link>
              {metrics.recentProjects[0] && (
                <Link href={`/projects/${metrics.recentProjects[0].id}`}>
                  <Button
                    variant="ghost"
                    className="rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 gap-1.5"
                  >
                    <Kanban className="w-3.5 h-3.5" />
                    <span>Open Kanban Board</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right 3D Visual Asset (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border-2 border-white/60 dark:border-white/10 group hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/images/dashboard-hero.jpg"
                alt="Tasko Teamwork & Kanban Workspace"
                fill
                className="object-cover"
                priority
              />

              {/* Floating Pill Badge: Top Left */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border/60 text-[11px] font-bold text-foreground shadow-md">
                <Rocket className="w-3 h-3 text-amber-500" />
                <span>Sprint Launch</span>
              </div>

              {/* Floating Pill Badge: Bottom Right */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-600/95 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>{metrics.completionRate}% Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-indigo-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Projects
            </CardTitle>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{metrics.totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Active team workspaces
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-amber-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              In Progress
            </CardTitle>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {metrics.inProgressTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Tasks currently being tackled
            </p>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Completed
            </CardTitle>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.completedTasks}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {metrics.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        {/* Overdue / Due Soon */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-rose-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Urgent / Deadlines
            </CardTitle>
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {metrics.overdueTasksCount + metrics.dueSoonTasksCount}
            </div>
            <p className="text-xs text-rose-500 font-semibold mt-1">
              {metrics.overdueTasksCount} overdue • {metrics.dueSoonTasksCount} due soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Workflow Distribution Card */}
      <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Sprint Workflow Distribution</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live status breakdown across all project cards
            </p>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            Total: {metrics.totalTasks} tasks
          </span>
        </div>

        {/* Multi-segment Colored Bar */}
        <div className="h-3.5 w-full rounded-full bg-muted/60 overflow-hidden flex gap-1 p-0.5">
          {todoPct > 0 && (
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${todoPct}%` }}
              title={`To Do: ${metrics.todoTasks} tasks (${todoPct}%)`}
            />
          )}
          {inProgressPct > 0 && (
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${inProgressPct}%` }}
              title={`In Progress: ${metrics.inProgressTasks} tasks (${inProgressPct}%)`}
            />
          )}
          {inReviewPct > 0 && (
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${inReviewPct}%` }}
              title={`In Review: ${metrics.inReviewTasks} tasks (${inReviewPct}%)`}
            />
          )}
          {donePct > 0 && (
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${donePct}%` }}
              title={`Done: ${metrics.completedTasks} tasks (${donePct}%)`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
            <span className="text-muted-foreground">To Do:</span>
            <strong className="text-foreground">{metrics.todoTasks}</strong>
            <span className="text-muted-foreground/70">({todoPct}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-muted-foreground">In Progress:</span>
            <strong className="text-foreground">{metrics.inProgressTasks}</strong>
            <span className="text-muted-foreground/70">({inProgressPct}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
            <span className="text-muted-foreground">In Review:</span>
            <strong className="text-foreground">{metrics.inReviewTasks}</strong>
            <span className="text-muted-foreground/70">({inReviewPct}%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-muted-foreground">Done:</span>
            <strong className="text-foreground">{metrics.completedTasks}</strong>
            <span className="text-muted-foreground/70">({donePct}%)</span>
          </div>
        </div>
      </Card>

      {/* Grid: Recent Projects & Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects (2 Cols) */}
        <Card className="lg:col-span-2 rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Your Project Boards</CardTitle>
              <CardDescription className="text-xs">
                Quickly jump to your active Kanban workflows
              </CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <span>All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {metrics.recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metrics.recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="p-5 rounded-2xl border border-border/50 bg-background/50 hover:border-indigo-500/40 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {project.name}
                        </h4>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </div>
                      {project.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                      <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                        <span>{project.membersCount} members</span>
                        <span className="font-bold text-foreground">
                          {project.completedCount}/{project.tasksCount} done ({project.progressPercent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border/70">
                <p className="text-xs text-muted-foreground mb-3">No projects found</p>
                <CreateProjectDialog />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Urgent Tasks (1 Col) */}
        <Card className="rounded-3xl border-border/60 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <CardTitle className="text-base font-bold">Urgent & Due Tasks</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Tasks requiring attention or upcoming deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.urgentTasks.length > 0 ? (
              metrics.urgentTasks.map((task) => {
                const priorityMeta = TASK_PRIORITIES.find((p) => p.id === task.priority)
                const isOverdue =
                  task.deadline && new Date(task.deadline).getTime() < new Date().getTime()

                return (
                  <Link
                    key={task.id}
                    href={`/projects/${task.projectId}`}
                    className="flex flex-col p-3.5 rounded-2xl border border-border/50 bg-background/50 hover:bg-accent/40 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] text-muted-foreground font-medium truncate">
                        {task.projectName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${priorityMeta?.badgeClass}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <h5 className="text-xs font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {task.title}
                    </h5>
                    {task.deadline && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span
                          className={
                            isOverdue
                              ? "text-rose-500 font-bold"
                              : "text-muted-foreground"
                          }
                        >
                          {isOverdue ? "Overdue: " : "Due: "}
                          {new Date(task.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </Link>
                )
              })
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-foreground">All caught up!</p>
                <p className="mt-1 text-[11px]">No urgent tasks pending right now.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
