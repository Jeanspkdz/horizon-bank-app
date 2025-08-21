import { User } from "@/modules/auth/types";
import { BankConnection } from "@/modules/bankConnection/types";
import { z } from "zod";

const BankAccount = z.object({
  id: z.string(),
  externalAccountId: z.string(),
  fundingSourceUrl: z.string(),
  name: z.string(),
  officialName: z.string(),
  type: z.string(),
  subtype: z.string(),
  balance: z.number(),
  bankConnectionId: z.string(),
  shareableId: z.string()
});
const BankAccountCreateInput = BankAccount.omit({ id: true });
const BankAccountUpdateInput = BankAccount.omit({ id: true, shareableId: true }).partial();
const BankAccountWithBankConnection = BankAccount.extend({
  bankConnection: BankConnection,
});

export interface BankAccountIncludeOptions {
  bankConnection?: boolean;
}

// A
// export type BankAccountWithInclude<T extends BankAccountIncludeOptions = {}> =
//   T extends { bankConnection: true }
//     ? BankAccount & { bankConnection: BankConnection }
//     : BankAccount;


// B
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type BankAccountWithInclude<T extends BankAccountIncludeOptions = {}> = Expand<
  BankAccount & 
    (T extends {bankConnection: true}
     ? {bankConnection: BankConnection}
     : {})
>


export type BankAccount = z.infer<typeof BankAccount>;
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateInput>;
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateInput>;
export type BankAccountWithBankConnection = z.infer<
  typeof BankAccountWithBankConnection
>;
