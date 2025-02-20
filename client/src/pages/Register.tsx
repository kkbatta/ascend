import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Helper function to generate random user data
const generateRandomUser = () => {
  const randomString = (length: number) =>
    Math.random().toString(36).substring(2, 2 + length);

  const randomDate = () => {
    const start = new Date(1970, 0, 1);
    const end = new Date(2000, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  };

  return {
    username: `user_${randomString(8)}`,
    password: `Pass${randomString(8)}!`,
    email: `test_${randomString(8)}@example.com`,
    fullName: `Test User ${randomString(4)}`,
    dateOfBirth: randomDate(),
    aboutMe: `I am a test user generated for development purposes. Random ID: ${randomString(6)}`,
  };
};

const Register = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const referralCode = searchParams.get('ref');

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      fullName: '',
      dateOfBirth: '',
      aboutMe: '',
      referralCode: referralCode || undefined,
    },
  });

  const fillRandomData = () => {
    const randomData = generateRandomUser();
    Object.entries(randomData).forEach(([key, value]) => {
      form.setValue(key as keyof typeof randomData, value);
    });
    toast({
      title: "Form filled with random data",
      description: "You can now submit the form or modify the values.",
    });
  };

  const onSubmit = async (data) => {
    try {
      // Simulate payment processing
      toast({
        title: "Processing payment...",
        description: "Please wait while we process your $100 lifetime membership fee.",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Register user
      const response = await apiRequest('POST', '/api/register', data);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Registration failed');
      }

      const user = await response.json();

      toast({
        title: "Registration successful!",
        description: "Welcome to our MLM platform!",
      });

      setLocation('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Join Our Network</CardTitle>
              {referralCode && (
                <p className="text-sm text-gray-500">
                  Referred with code: {referralCode}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fillRandomData}
                  className="w-full"
                >
                  Fill with Random Data
                </Button>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aboutMe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About Me</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="text-blue-800 font-medium mb-2">Lifetime Membership</h3>
                    <p className="text-blue-600">One-time payment: $100</p>
                  </div>

                  <Button type="submit" className="w-full">
                    Register & Pay
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden lg:block relative w-0 flex-1 bg-blue-600">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-6">
            Build Your Future with Us
          </h2>
          <ul className="space-y-4 text-lg">
            <li>✓ Join a thriving community of entrepreneurs</li>
            <li>✓ Access exclusive training and resources</li>
            <li>✓ Earn commissions through our MLM program</li>
            <li>✓ Get lifetime access with one-time payment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;