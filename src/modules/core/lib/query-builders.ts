import { BankAccountIncludeOptions } from "@/modules/bankAccounts/types";
import { BankConnectionIncludeOptions } from "@/modules/bankConnection/types";
import {
  BaseModel,
  ModelIncludeOptions,
  ModelPagOptions,
  QueryFilter,
} from "@/modules/core/types";
import { BankTransactionIncludeOptions } from "@/modules/transactions/types";
import { Query } from "node-appwrite";

export function buildQueryFilters<
  TModel extends BaseModel,
  KModel extends Extract<keyof TModel, string>
>(queryFilters: QueryFilter<TModel, KModel>[]) {
  return queryFilters.map((filter) => {
    const field = filter.field;
    const value = filter.value;

    if (value == null) {
      return Query.isNull(field);
    }

    switch (filter.operator) {
      case "equal":
        return Query.equal(field, value);
      case "notEqual":
        return Query.notEqual(field, value);
      case "greater":
        return Query.greaterThan(field, value);
      case "greaterEqual":
        return Query.greaterThanEqual(field, value);
      case "less":
        return Query.lessThan(field, value);
      case "lessEqual":
        return Query.lessThanEqual(field, value);
      case "contains":
        return Query.contains(field, value as string);
      default:
        return Query.equal(field, value);
    }
  });
}

export function buildIncludeOptions(
  includeOptions?: BankAccountIncludeOptions
): string;
export function buildIncludeOptions(
  includeOptions?: BankConnectionIncludeOptions
): string;
export function buildIncludeOptions(
  includeOptions?: BankTransactionIncludeOptions
): string;
export function buildIncludeOptions<
  TModel extends ModelIncludeOptions[keyof ModelIncludeOptions]
>(includeOptions?: TModel): string {
  let query = ["*"];

  if (!includeOptions) {
    return Query.select(query);
  }

  if ("bankAccount" in includeOptions) {
    query.push("bankAccountId.*");
  }

  if ("bankConnection" in includeOptions) {
    query.push("bankConnectionId.*");
  }
  if ("user" in includeOptions) {
    query.push("userId.*");
  }

  return Query.select(query);
}

export function buildPagOptions<PagOption extends ModelPagOptions>(
  pagOptions?: PagOption
) {
  const query: string[] = [];
  if (!pagOptions) return query;

  if (pagOptions.limit) {
    query.push(Query.limit(pagOptions.limit));
  }
  if (pagOptions.offset) {
    query.push(Query.offset(pagOptions.offset));
  }
  if (pagOptions.cursorAfter) {
    query.push(Query.cursorAfter(pagOptions.cursorAfter));
  }
  if (pagOptions.cursorBefore) {
    query.push(Query.cursorBefore(pagOptions.cursorBefore));
  }

  return query;
}
