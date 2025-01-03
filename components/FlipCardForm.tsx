"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "@/lib/auth"

const FlipCardForm = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true)
  const { login } = useAuth()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email)
      toast.success("Logged in successfully")
      onClose()
    } catch (error) {
      toast.error("Login failed")
    }
  }

  const handleSignup = async (data: SignupFormData) => {
    try {
      // Simulate signup success
      toast.success("Account created successfully! You can now log in.")
      setIsLogin(true)
      signupForm.reset()
    } catch (error) {
      toast.error("Failed to create account")
    }
  }

  return (
    <div className="flip-card-wrapper">
      <div className="auth-toggle-container">
        <div className="auth-toggle-switch">
          <input
            type="checkbox"
            id="auth-toggle"
            checked={!isLogin}
            onChange={() => setIsLogin(!isLogin)}
            className="auth-toggle-input"
          />
          <label htmlFor="auth-toggle" className="auth-toggle-label">
            <span className="auth-toggle-inner"></span>
            <span className="auth-toggle-switch"></span>
          </label>
          <div className="auth-toggle-labels">
            <span className={isLogin ? 'active' : ''}>Log in</span>
            <span className={!isLogin ? 'active' : ''}>Sign up</span>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="auth-form">
            <h2 className="auth-title">Log in</h2>
            <div className="form-group">
              <input
                {...loginForm.register("email")}
                type="email"
                placeholder="Email"
                className="auth-input"
              />
              {loginForm.formState.errors.email && (
                <p className="error-message">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...loginForm.register("password")}
                type="password"
                placeholder="Password"
                className="auth-input"
              />
              {loginForm.formState.errors.password && (
                <p className="error-message">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="auth-button">
              Let's go!
            </button>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="auth-form">
            <h2 className="auth-title">Sign up</h2>
            <div className="form-group">
              <input
                {...signupForm.register("name")}
                type="text"
                placeholder="Name"
                className="auth-input"
              />
              {signupForm.formState.errors.name && (
                <p className="error-message">{signupForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...signupForm.register("email")}
                type="email"
                placeholder="Email"
                className="auth-input"
              />
              {signupForm.formState.errors.email && (
                <p className="error-message">{signupForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...signupForm.register("password")}
                type="password"
                placeholder="Password"
                className="auth-input"
              />
              {signupForm.formState.errors.password && (
                <p className="error-message">{signupForm.formState.errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="auth-button">
              Confirm!
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default FlipCardForm

