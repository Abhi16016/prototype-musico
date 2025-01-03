"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Define the Input component and InputProps interface
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`h-11 bg-[#121212] border-white/10 text-white placeholder:text-white/50 pe-9 ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";

interface PasswordInputProps extends Omit<InputProps, "type"> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkRequirements = (pass: string = "") => {
      const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /[0-9]/, text: "At least 1 number" },
        { regex: /[a-z]/, text: "At least 1 lowercase letter" },
        { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      ];

      return requirements.map((req) => ({
        met: req.regex.test(pass),
        text: req.text,
      }));
    };

    const requirements = checkRequirements(props.value as string);

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            {...props}
            ref={ref}
            type={isVisible ? "text" : "password"}
            className={className}
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-white/50 hover:text-white transition-colors"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>

        <ul className="space-y-1.5" aria-label="Password requirements">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className={`text-sm ${req.met ? "text-white" : "text-white/50"}`}>
                {req.met ? "✓" : "×"} {req.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
