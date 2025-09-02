import { BankConnection } from "@/modules/bankConnection/types";
import { Expand, ModelQueryFilters } from "@/modules/core/types";
import { z } from "zod";

export const BankAccount = z.object({
  id: z.string(),
  externalAccountId: z.string(),
  fundingSourceUrl: z.string(),
  name: z.string(),
  officialName: z.string(),
  type: z.string(),
  subtype: z.string(),
  balance: z.number(),
  bankConnectionId: z.string(),
  shareableId: z.string(),
});

const BankAccountCreateInput = BankAccount.omit({
  id: true,
  shareableId: true,
});
const BankAccountUpdateInput = BankAccount.omit({
  id: true,
  shareableId: true,
}).partial();

const BankAccountWithBankConnection = z.object({
  ...BankAccount.shape,
  bankConnection: BankConnection,
});

export type GetBankAccountsArgs = {
  queryFilters: ModelQueryFilters<BankAccount>[];
  includeOptions?: BankAccountIncludeOptions;
};

export type BankAccountIncludeOptions = {
  bankConnection: boolean ;
}

export type BankAccountWithInclude<T extends BankAccountIncludeOptions | undefined> =
  Expand<
    BankAccount &
      (T extends { bankConnection: true }
        ? { bankConnection: BankConnection; bankConnectionId: string }
        : {})
  >;

export type BankAccount = z.infer<typeof BankAccount>;
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateInput>;
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateInput>;
export type BankAccountWithBankConnection = z.infer<
  typeof BankAccountWithBankConnection
>;
