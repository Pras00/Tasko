import { z } from "zod"

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
})

export const updateProjectSchema = createProjectSchema

export type CreateProjectInput = z.infer<typeof createProjectSchema>
