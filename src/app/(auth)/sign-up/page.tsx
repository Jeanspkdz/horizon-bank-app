"use client";

import { DatePicker } from "@/modules/auth/components/date-picker";
import FormWrapper from "@/modules/auth/components/form-wrapper";
import { SignUpSchema } from "@/modules/auth/schemas";
import { Button } from "@/modules/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function SignUpPage() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    },
  });

  console.log(form.watch("dateOfBirth"));

  const onSubmit = (values: SignUpSchema) => {
    console.log(values);
  };

  return (
    <section className="max-w-10/12 min-w-7/12 lg:max-w-[420px] py-16">
      <FormWrapper
        title="Sign Up"
        message="Please enter your details"
        altQuestionText="Are you already registered?"
        altActionLink="/sign-in"
        altActionText="Sign in"
      >
        <Form {...form}>
          <form
            className="flex flex-col gap-y-8 "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1/2">
                    <FormLabel className="text-gray-600">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your fistname"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1/2">
                    <FormLabel className="text-gray-600">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your lastname"
                        {...field}
                        className="focus-visible:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your specific address"
                      {...field}
                      className="focus-visible:ring-blue-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1/2">
                    <FormLabel className="text-gray-600">State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: NY"
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
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="flex-1/2">
                    <FormLabel className="text-gray-600">Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: 11101"
                        {...field}
                        className="focus-visible:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex-1/2">
                    <FormLabel className="text-gray-600">
                      Date Of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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
                name="ssn"
                render={({ field }) => (
                  <FormItem className="flex-1/2">
                    <FormLabel className="text-gray-600">SSN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ex: 1234"
                        {...field}
                        className="focus-visible:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage className="max-w-full" />
                  </FormItem>
                )}
              />
            </div>

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
              type="submit"
              className="text-white bg-blue-500 capitalize hover:bg-blue-600 cursor-pointer transition-colors"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </FormWrapper>
    </section>
  );
}

export default SignUpPage;
