'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useAuthStore } from '@repo/store';

import { authClient } from './../lib/auth-client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Label } from '@workspace/ui/components/label';

type FormData = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const router = useRouter();

  const {
    mode,
    message,
    setMessage,
    togglePassword,
    showpassword,
    toggleMode,
    clearMessage,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

 async function onSubmit(data: FormData) {
  clearMessage();

  try {
    if (mode === "login") {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setMessage(res.error.message || "Login failed");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const session = await authClient.getSession();

      if (!session?.data?.user) {
        setMessage("Session not created. Please try again.");
        return;
      }

      router.replace("/work");
      return;
    }

    const res = await authClient.signUp.email({
      name: data.name!,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setMessage(res.error.message || "Signup failed");
      return;
    }

    // Signup success (204 is OK)
    setMessage("Signup successful. Please login.");
    toggleMode();
    reset();

  } catch (err: any) {
    console.error("AUTH ERROR:", err);
    setMessage(err?.message || "Authentication failed");
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">

      <Card className="w-full max-w-md shadow-lg">

        <CardHeader className="space-y-1 text-center">

          <CardTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </CardTitle>

          <CardDescription>
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Fill in details to create a new account'}
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {mode === 'signup' && (
              <div className="space-y-1">

                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  placeholder="Your name"
                  {...register('name', {
                    required: 'Name required',
                  })}
                />

                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}

              </div>
            )}

            {/* ✅ EMAIL */}
            <div className="space-y-1">

              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email required',
                })}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}

            </div>

            <div className="space-y-1">

              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type={showpassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />

              <button
                type="button"
                onClick={togglePassword}
                className="text-sm text-blue-500 mt-1"
              >
                {showpassword ? 'Hide' : 'Show'}
              </button>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}

            </div>

         
            {message && (
              <p className="text-sm text-destructive text-center">
                {message}
              </p>
            )}

            {/* ✅ SUBMIT */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Loading...'
                : mode === 'login'
                ? 'Login'
                : 'Sign Up'}
            </Button>

          </form>

          <div className="mt-4 text-center text-sm">

            <button
              type="button"
              onClick={() => {
                toggleMode();
                reset();
                clearMessage();
              }}
              className="text-primary underline-offset-4 hover:underline"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Login'}
            </button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}
