'use server'

import { hash, compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { SignupFormData, LoginFormData } from '@/lib/auth'

export async function createUser(data: SignupFormData) {
  const { name, email, password } = data

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function loginUser(data: LoginFormData) {
  const { email, password } = data

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { success: false, error: 'User not found. Please sign up.' }
    }

    // Check password
    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error('Error logging in:', error)
    return { success: false, error: 'Failed to log in' }
  }
}

