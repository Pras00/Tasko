import { z } from "zod"

export const addMemberSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
})

export const updateRoleSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
})

export type AddMemberInput = z.infer<typeof addMemberSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
