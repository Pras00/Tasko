import { PrismaClient, TaskStatus, TaskPriority, ProjectRole } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting Tasko database seeding...")

  // 1. Clean existing data (respecting foreign key order)
  await prisma.activityLog.deleteMany()
  await prisma.task.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // 2. Hash default password
  const passwordHash = await bcrypt.hash("password123", 10)

  // 3. Create Users
  const demoOwner = await prisma.user.create({
    data: {
      name: "Prasetyo Wibowo",
      email: "demo@tasko.dev",
      password: passwordHash,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  })

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah@tasko.dev",
      password: passwordHash,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  })

  const alex = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex@tasko.dev",
      password: passwordHash,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  })

  const maya = await prisma.user.create({
    data: {
      name: "Maya Chen",
      email: "maya@tasko.dev",
      password: passwordHash,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
  })

  console.log(`Created 4 users: ${demoOwner.email}, ${sarah.email}, ${alex.email}, ${maya.email}`)

  // 4. Create Main Project
  const mainProject = await prisma.project.create({
    data: {
      name: "Tasko Web App 2.0",
      description:
        "Mini Trello SaaS project management web application with Kanban boards, authentication, and productivity metrics.",
      ownerId: demoOwner.id,
    },
  })

  const mobileProject = await prisma.project.create({
    data: {
      name: "Mobile Companion App",
      description: "Cross-platform mobile client companion for real-time task notifications.",
      ownerId: demoOwner.id,
    },
  })

  // 5. Add Memberships
  await prisma.projectMember.createMany({
    data: [
      { projectId: mainProject.id, userId: demoOwner.id, role: ProjectRole.OWNER },
      { projectId: mainProject.id, userId: sarah.id, role: ProjectRole.ADMIN },
      { projectId: mainProject.id, userId: alex.id, role: ProjectRole.MEMBER },
      { projectId: mainProject.id, userId: maya.id, role: ProjectRole.MEMBER },
      { projectId: mobileProject.id, userId: demoOwner.id, role: ProjectRole.OWNER },
      { projectId: mobileProject.id, userId: sarah.id, role: ProjectRole.ADMIN },
    ],
  })

  console.log("Project memberships configured.")

  // Helper date generators
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // 6. Create Tasks for mainProject
  await prisma.task.createMany({
    data: [
      {
        projectId: mainProject.id,
        title: "Design user profile modal & settings panel",
        description: "Add user avatar upload, password change form, and notification preferences.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assigneeId: maya.id,
        createdById: demoOwner.id,
        deadline: inThreeDays,
        order: 1000,
      },
      {
        projectId: mainProject.id,
        title: "Audit accessibility for screen readers & WCAG AA",
        description: "Ensure all interactive buttons, modals, and dropdowns have proper ARIA attributes.",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        assigneeId: alex.id,
        createdById: demoOwner.id,
        deadline: nextWeek,
        order: 2000,
      },
      {
        projectId: mainProject.id,
        title: "Implement Supabase connection pooler & schema",
        description: "Configure DATABASE_URL with pgbouncer transaction pooling and directUrl for migrations.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.URGENT,
        assigneeId: demoOwner.id,
        createdById: demoOwner.id,
        deadline: tomorrow,
        order: 1000,
      },
      {
        projectId: mainProject.id,
        title: "Refine Framer Motion drag gestures on Kanban",
        description: "Ensure dragging feels snappy, adds subtle shadow elevation, and works smoothly on touch devices.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: sarah.id,
        createdById: demoOwner.id,
        deadline: inThreeDays,
        order: 2000,
      },
      {
        projectId: mainProject.id,
        title: "Review NextAuth v5 session middleware & edge protection",
        description: "Validate token refresh and ensure unauthorized redirects land on /login with callbackUrl.",
        status: TaskStatus.IN_REVIEW,
        priority: TaskPriority.HIGH,
        assigneeId: sarah.id,
        createdById: demoOwner.id,
        deadline: yesterday, // Overdue demo
        order: 1000,
      },
      {
        projectId: mainProject.id,
        title: "Initialize Next.js 16 project structure & Tailwind v4",
        description: "Set up App Router, TypeScript strict mode, and base folder architecture.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        assigneeId: demoOwner.id,
        createdById: demoOwner.id,
        order: 1000,
      },
      {
        projectId: mainProject.id,
        title: "Configure shadcn/ui components & joyful color theme",
        description: "Set up buttons, cards, dialogs, inputs, and accessible color tokens.",
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        assigneeId: demoOwner.id,
        createdById: demoOwner.id,
        order: 2000,
      },
      {
        projectId: mainProject.id,
        title: "Implement theme switcher with animated Sun/Moon logo",
        description: "Smooth rotating morph effect between Sun and Moon when switching light/dark mode.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        assigneeId: demoOwner.id,
        createdById: demoOwner.id,
        order: 3000,
      },
    ],
  })

  console.log("✅ Database seeded successfully with realistic demo data!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
