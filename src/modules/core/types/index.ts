import {
  BankAccountIncludeOptions
} from "@/modules/bankAccounts/types";
import {
  BankConnectionIncludeOptions
} from "@/modules/bankConnection/types";
import { BankTransactionIncludeOptions } from "@/modules/transactions/types";
import { z } from "zod";
import { CustomError } from "../errors";

export type Response<T> =
  | { success: true; data: T }
  | { success: false; error: CustomError };

type KnownPropertiesOnly<TargetType, ReferenceType> = {
  [K in keyof TargetType]: K extends keyof ReferenceType
    ? TargetType[K]
    : never;
};

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export const BaseModelT = z.object({}).brand<"HozBaseModel">()
export const BaseModel = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
export type BaseModel = z.infer<typeof BaseModel>
export type BaseModelT = z.infer<typeof BaseModelT>

//QUERY_FILTERS
export type QueryFilter<T extends BaseModel, K extends keyof T = keyof T> = {
  field: K;
  value: T[K];
  operator?: QueryOperators<T[K]>;
};
export type QueryOperators<ValueType> = ValueType extends number
  ? "equal" | "notEqual" | "greater" | "greaterEqual" | "less" | "lessEqual"
  : ValueType extends string
  ? "equal" | "notEqual" | "contains"
  : ValueType extends boolean
  ? "equal" | "notEqual"
  : "equal" | "notEqual";

export type ModelQueryFilters<TModel extends BaseModel> = {
  [K in keyof TModel]: QueryFilter<TModel, K>;
}[keyof TModel];

export type ModelPagOptions = {
  limit?: number,
  offset?: number,
  cursorAfter?: string,
  cursorBefore?: string
}

//INCLUDE OPTIONS
export type ModelIncludeOptions = {
  "BankAccount" : BankAccountIncludeOptions,
  "BankConnection" : BankConnectionIncludeOptions
  "Transaction": BankTransactionIncludeOptions
}

// export type ModelIncludeOptions<TModel extends BaseModel> =
//   TModel extends BankAccount
//     ? BankAccountIncludeOptions
//     : TModel extends BankConnection
//     ? BankConnectionIncludeOptions
//     : TModel extends Transaction
//     ? BankTransactionIncludeOptions
//     : never;
