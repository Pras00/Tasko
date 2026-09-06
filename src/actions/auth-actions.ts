"use server"

import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type RegisterActionResponse = {
  success: boolean
  message: string
}

export async function registerUser(
  formData: FormData
): Promise<RegisterActionResponse> {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }

    const validation = registerSchema.safeParse(rawData)
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || "Invalid input data",
      }
    }

    const { name, email, password } = validation.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: "Account created successfully! You can now log in.",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "Something went wrong during registration. Please try again.",
    }
  }
}
