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
    .trim()
    .uuid({message:"Enter a valid shareable ID"}),
  amount: z.coerce.number().gte(5, {message: "The minimum amount allowed is 5"}),
});

export type TransferFormSchema = z.infer<typeof TransferFormSchema>;
