import { BankConnection } from "@/modules/bankConnection/types";
import { DefaultError } from "@/modules/core/errors";
import { Models } from "node-appwrite";
import { z } from "zod";
import {
  BankAccount,
  BankAccountWithInclude,
  GetBankAccountsArgs
} from "@/modules/bankAccounts/types";

export function mapToBankAccount<IOptions extends GetBankAccountsArgs["includeOptions"]>(
  document: Models.DefaultRow & Record<string, unknown>,
  include?: IOptions
) : BankAccountWithInclude<IOptions>{

  let schema = BankAccount;

  let normalizedDocument: Record<string, unknown> = {
    ...document,
    id: document.$id,
  };


  if (include?.bankConnection) {
    schema = schema.extend({
      bankConnectionId: z.string(),
      bankConnection: BankConnection,
    });

    const bankConnectionId = (normalizedDocument.bankConnectionId as Record<string, unknown>).$id 
    const bankConnection = normalizedDocument.bankConnectionId as Record<string, unknown>
    bankConnection["id"] = bankConnection.$id

    normalizedDocument = {
      ...normalizedDocument,
      bankConnection: bankConnection,
      bankConnectionId: bankConnectionId,
    };
  }

  const parsed = schema.safeParse(normalizedDocument);

  if (!parsed.success) {
    console.log(parsed.error.format());
    
    throw new DefaultError("Failed to parse BankAccount");
  }

  return parsed.data as BankAccountWithInclude<IOptions> ;
}
