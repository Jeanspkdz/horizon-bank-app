import { User } from "@/modules/auth/types";
import { Expand } from "@/modules/core/types";
import { LinkTokenCreateResponse } from "plaid";
import { z } from "zod";

export const BankConnection = z.object({
  id: z.string(),
  userId: z.string(),
  accessToken: z.string(), //Plaid
  itemId: z.string(), //Plaid
});
export const BankConnectionCreateInput = BankConnection.partial({ id: true });

export type BankConnectionIncludeOptions = {
  user: boolean;
};

type T = BankConnectionWithInclude<{ user: true }>;

export type BankConnectionWithInclude<
  T extends BankConnectionIncludeOptions | undefined
> = Expand<
  BankConnection &
    (T extends { user: true } ? { userId: string; user: User } : {})
>;

export type BankConnection = z.infer<typeof BankConnection>;
export type BankConnectionCreateInput = z.infer<
  typeof BankConnectionCreateInput
>;

//Plaid
export type LinkToken = LinkTokenCreateResponse["link_token"];

//Dwolla
export type VerifiedPersonalCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};
