import { notFound, redirect } from "next/navigation"
import { getProjectById } from "@/actions/project-actions"
import { ProjectDetailView } from "@/components/project/project-detail-view"
import { auth } from "@/lib/auth"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params

  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <ProjectDetailView
      project={project as React.ComponentProps<typeof ProjectDetailView>["project"]}
    />
  )
}
