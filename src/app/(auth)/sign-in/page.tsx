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
import { signIn } from "@/modules/auth/actions/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

function SignInPage() {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInSchema) => {
    const response = await signIn(values);

    if (response.success) {
      toast.success("Sign In Successful");
      return redirect("/");
    }

    console.log(response.error);

    toast.error(response.error.message);
  };

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
          <form
            className="flex flex-col gap-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                  <FormMessage />
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
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="focus-visible:ring-blue-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="text-white bg-blue-500 capitalize hover:bg-blue-600 cursor-pointer transition-colors"
            >
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </FormWrapper>
    </section>
  );
}

export default SignInPage;
