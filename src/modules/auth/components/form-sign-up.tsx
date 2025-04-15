import { signUp } from "@/modules/auth/actions/auth";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/modules/core/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { User } from "../types";

interface FormSignUpProps {
  updateUser: (user: User) => void;
}

export const FormSignUp = ({ updateUser }: FormSignUpProps) => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city:"",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
    const response = await signUp(values);

    if (response.success) {
      toast.success("Sign Up Successful");
      updateUser(response.data);
      return;
    }
    console.log(response.error);
    toast.error(response.error.message);
  };

  return (
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

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your city"
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
                  <FormLabel className="text-gray-600">Date Of Birth</FormLabel>
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
            variant={"primary"}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader className="animate-spin" />
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
};
