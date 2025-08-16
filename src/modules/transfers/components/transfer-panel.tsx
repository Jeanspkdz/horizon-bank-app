"use client";

import { BankAccount } from "@/modules/bankAccounts/types";
import { AsyncBankCardSelect } from "@/modules/core/components/async-bank-card-select";
import { Button } from "@/modules/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { Skeleton } from "@/modules/core/components/ui/skeleton";
import { Textarea } from "@/modules/core/components/ui/textarea";
import { TransferFormSchema } from "@/modules/transfers/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TransferPanelProps {
  bankAccountsPromise: Promise<BankAccount[]>;
}

export const TransferPanel = ({ bankAccountsPromise }: TransferPanelProps) => {
  const form = useForm<TransferFormSchema>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      amount: 0,
      bankAccountId: "",
      note: "",
      recipientEmail: "",
      sharableId: "",
    },
  });

  const onSubmit: SubmitHandler<TransferFormSchema> = (values) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="mt-5 mb-8">
            <h2 className="font-bold text-lg">Transfer Details</h2>
            <p className="text-slate-700">Enter the details of the recipient</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-12">
              <div className="flex-4/12 ">
                <h4 className="font-medium"> Select Source Bank</h4>
                <p className="text-slate-700">
                  Select the bank account you want to transfer funds from
                </p>
              </div>

              <div className="flex-8/12">
                <FormField
                  control={form.control}
                  name="bankAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Suspense fallback={<Skeleton className="w-[190px] h-10"/>}>
                          <AsyncBankCardSelect
                            bankAccontsPromise={bankAccountsPromise}
                            onValueChange={field.onChange}
                            value={field.value}
                          />
                        </Suspense>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex-4/12 ">
                <h4 className="font-medium"> Transfer Note (Optional)</h4>
                <p className="text-slate-700">
                  Please provide any additional information or instructions
                  related to the transfer
                </p>
              </div>

              <div className="flex-8/12">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter a note for this transfer (optional)"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mt-5 mb-8">
            <h2 className="font-bold text-lg">Bank account details</h2>
            <p className="text-slate-700">
              Enter the bank account details of the recipient
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-12">
              <div className="flex-4/12 ">
                <h4 className="font-medium">Recipient's Email Address</h4>
              </div>

              <div className="flex-8/12">
                <FormField
                  control={form.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter recipient's email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex-4/12 ">
                <h4 className="font-medium">Recipient's Plaid Sharable ID</h4>
              </div>

              <div className="flex-8/12">
                <FormField
                  control={form.control}
                  name="sharableId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter sharable ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex-4/12 ">
                <h4 className="font-medium">Amount</h4>
              </div>

              <div className="flex-8/12">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="ex 5.00" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          className="mt-8 w-full py-6 bg-brand-blue hover:bg-brand-blue/90 hover:cursor-pointer"
          type="submit"
        >
          Transfer Funds
        </Button>
      </form>
    </Form>
  );
};
