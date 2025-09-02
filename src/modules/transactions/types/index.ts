import { BankAccount } from "@/modules/bankAccounts/types";
import { Expand } from "@/modules/core/types";
import { z } from "zod";

export const Transaction = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(["success", "pending"]),
  category: z.string(),
  merchantName: z.string(),
  merchantLogoUrl: z.string().nullable(),
  datetime: z.string().datetime({offset: true}),
  externalTransactionId: z.string(),
  bankAccountId: z.string(),
});
const TransactionCreateInput = Transaction.omit({ id: true });
const TransactionUpdateInput = Transaction.omit({ id: true }).partial();

export type BankTransactionIncludeOptions = {
  bankAccount: boolean;
};

export type BankTransactionWithInclude<
  T extends BankTransactionIncludeOptions
> = Expand<
  Transaction &
    (T extends { bankAccount: true }
      ? { bankAccount: BankAccount; bankAccountId: string }
      : {})
>;

export type Transaction = z.infer<typeof Transaction>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateInput>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateInput>;
export type TransactionId = Transaction["id"];
