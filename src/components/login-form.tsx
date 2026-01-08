"use client";

import React, { useTransition } from "react";
import { Snowflake } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Import the actions we defined earlier
import { loginWithCredentials, loginWithProvider } from "@/app/actions/auth";

interface LoginFormProps extends React.ComponentProps<"div"> {
  isLoginForm: boolean;
}

export function LoginForm({
  className,
  isLoginForm,
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Handle Email/Password Login
  async function handleCredentialsLogin(formData: FormData) {
    startTransition(async () => {
      const result = await loginWithCredentials(formData);
      if (result?.error) {
        // You can replace this with a toast notification like sonner or shadcn toast
        alert(result.error);
      }
    });
  }

  // Handle Social Login
  const handleSocialLogin = (provider: "github") => {
    startTransition(async () => {
      await loginWithProvider(provider);
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={handleCredentialsLogin}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <Snowflake className="size-8" />
              </div>
              <span className="sr-only">Xed-Editor</span>
            </div>
            <h1 className="text-xl font-bold">
              {isLoginForm ? "Welcome back to Xed-Editor" : "Create an account"}
            </h1>
            <FieldDescription
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => {
                router.push(isLoginForm ? "/signup" : "/login");
              }}
            >
              {isLoginForm ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span className="underline">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="underline">Login</span>
                </>
              )}
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email" // Required for FormData
              type="email"
              placeholder="m@example.com"
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password" // Required for FormData
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Connecting..." : isLoginForm ? "Login" : "Sign Up"}
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => handleSocialLogin("github")}
          >
            <SiGithub size={20} className="mr-2" />
            Github
          </Button>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
