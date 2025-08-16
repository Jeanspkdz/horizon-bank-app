import { z } from "zod";

export const TransferFormSchema = z.object({
  bankAccountId: z.string().min(1, { message: "Please select a bank account" }),
  note: z.string().trim().optional(),
  recipientEmail: z
    .string()
    .email({ message: "Enter a valid email address" })
    .trim(),
  sharableId: z.coerce
    .string()
    .min(1, { message: "Enter a sharable ID" })
    .trim(),
  amount: z.coerce.number().min(1, { message: "Enter a valid amount" }),
});

export type TransferFormSchema = z.infer<typeof TransferFormSchema>;
