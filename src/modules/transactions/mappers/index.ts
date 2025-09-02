import { Models } from "node-appwrite";
import {
  BankTransactionIncludeOptions,
  BankTransactionWithInclude,
  Transaction,
} from "../types";
import { z } from "zod";
import { BankAccount } from "@/modules/bankAccounts/types";
import { DefaultError } from "@/modules/core/errors";

export function mapToBankTransaction<
  IOptions extends BankTransactionIncludeOptions
>(document: Models.DefaultRow & Record<string, unknown>, include?: IOptions) {
  console.log("DOC_TRANSACTION TO MAP", document);

  let schema = Transaction;

  let normalizedDocument: Record<string, unknown> = {
    ...document,
    id: document.$id,
  };

  if (include?.bankAccount) {
    schema = schema.extend({
      bankAccountId: z.string(),
      bankAccount: BankAccount,
    });

    const bankAccountId = (
      normalizedDocument.bankAccountId as Record<string, unknown>
    ).$id;
    const bankAccount = normalizedDocument.bankAccountId as Record<
      string,
      unknown
    >;
    bankAccount["id"] = bankAccount.$id;

    normalizedDocument = {
      ...normalizedDocument,
      bankAccount,
      bankAccountId,
    };
  }

  const parsed = schema.safeParse(normalizedDocument);
  console.log("MAP PARSED", parsed);

  if (!parsed.success) {
    console.log(parsed.error.format());
    throw new DefaultError("Failed to parse BankTransaction");
  }

  return parsed.data as BankTransactionWithInclude<IOptions>;
}
