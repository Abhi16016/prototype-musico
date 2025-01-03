"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./password-input"
import { signupSchema, type SignupFormData } from "@/lib/auth"
import { createUser } from "@/app/actions/auth"
import { toast } from "sonner"

interface SignupFormProps {
  onClose: () => void
}

export function SignupForm({ onClose }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const password = watch('password', '');

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true)
    try {
      const result = await createUser(data)
      
      if (result.success) {
        toast.success("Account created successfully! You can now log in.")
        onClose()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      toast.error("Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-center text-white">Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Name"
          className="h-11 bg-[#121212] border-white/10 text-white placeholder:text-white/50"
        />
        <Input
          {...register("email")}
          placeholder="Email"
          className="h-11 bg-[#121212] border-white/10 text-white placeholder:text-white/50"
        />
        <PasswordInput
          {...register("password")}
          placeholder="Password"
          value={password}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-white text-black rounded-md font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  )
}

