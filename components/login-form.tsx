"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./password-input"
import { loginSchema, type LoginFormData } from "@/lib/auth"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

interface LoginFormProps {
  onClose: () => void
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const password = watch('password', '');

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    try {
      await login(data.email)
      toast.success("Logged in successfully")
      onClose()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-center text-white">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          Let's go!
        </button>
      </form>
    </div>
  )
}

