import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AscendLogo } from "@/components/dashboard/AscendLogo";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Login Form */}
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your MLM dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-8 text-white">
        <AscendLogo width={320} height={160} />
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Manage Your MLM Business
          </h2>
          <p className="text-xl opacity-90">
            Access comprehensive analytics, team performance metrics, and advanced commission tracking
          </p>
        </div>
      </div>
    </div>
  );
}
