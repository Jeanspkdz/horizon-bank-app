"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/modules/auth/components/form-wrapper";
import { SignInSchema } from "@/modules/auth/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { Button } from "@/modules/core/components/ui/button";

function SignInPage() {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInSchema) => {
    console.log(values);
  }

  return (
    <section className="max-w-10/12 md:max-w-[420px]">
      <FormWrapper
        title="Log in"
        message="Welcome Back! Please enter your details"
        altActionText="Sign up"
        altActionLink="/sign-up"
        altQuestionText="Dont'have an account?"
      >
        <Form {...form}>
          <form className="flex flex-col gap-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="focus-visible:ring-blue-200"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      className="focus-visible:ring-blue-200"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button type="submit" className="text-white bg-blue-500 capitalize hover:bg-blue-600 cursor-pointer transition-colors">Sign In</Button>
          </form>
        </Form>
      </FormWrapper>
    </section>
  );
}

export default SignInPage;
