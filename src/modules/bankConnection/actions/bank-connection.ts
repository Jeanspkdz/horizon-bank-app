"use server";

import {
  BankConnection,
  BankConnectionCreateInput,
  BankConnectionIncludeOptions,
} from "@/modules/bankConnection/types";
import { createAdminClient } from "@/modules/core/actions/appwrite";
import { DefaultError } from "@/modules/core/errors";
import {
  buildIncludeOptions,
  buildQueryFilters,
} from "@/modules/core/lib/query-builders";
import { ModelIncludeOptions, ModelQueryFilters } from "@/modules/core/types";
import { ID } from "node-appwrite";
import { mapToBankConnection } from "../mappers";

const { APPWRITE_DB, APPWRITE_BANK_CONNECTION_COLLECTION } = process.env;

export async function createBankConnection(
  bankConnection: BankConnectionCreateInput
): Promise<BankConnection> {
  try {
    const { tableDB } = await createAdminClient();

    const rowCreated = await tableDB.createRow({
      databaseId: APPWRITE_DB!!,
      tableId: APPWRITE_BANK_CONNECTION_COLLECTION!!,
      data: bankConnection,
      rowId: ID.unique(),
    });

    const bankConnectionCreated: BankConnection = {
      id: rowCreated.$id,
      userId: rowCreated["userId"],
      accessToken: rowCreated["accessToken"],
      itemId: rowCreated["itemId"],
    };

    return bankConnectionCreated;
  } catch (error) {
    console.log("[ERR_CREATE_BANK_ACCOUNT]", error);
    throw new DefaultError("Error creating bank account");
  }
}

export async function getBankConnection<
  MQuery extends ModelQueryFilters<BankConnection>[],
  IOptions extends ModelIncludeOptions["BankConnection"]
>({
  queryFilters,
  includeOptions,
}: {
  queryFilters: MQuery;
  includeOptions?: IOptions;
}) {
  const { tableDB } = await createAdminClient();

  const builtQueryFilters = buildQueryFilters(queryFilters);
  const builtIncludeOptions = buildIncludeOptions(includeOptions);

  const { rows } = await tableDB.listRows({
    databaseId: APPWRITE_DB!!,
    tableId: APPWRITE_BANK_CONNECTION_COLLECTION!!,
    queries: [...builtQueryFilters, builtIncludeOptions],
  });

  const bankConnections = rows.map((row) =>
    mapToBankConnection(row, includeOptions)
  );

  return bankConnections;
}

export async function getBankConnectionsByUserId<IOptions extends BankConnectionIncludeOptions>(
  {
    userId,
    includeOptions
  }: {
    userId: string
    includeOptions?: IOptions
  }
): Promise<BankConnection[]> {
  try {
    const bankConnections = await getBankConnection({
      queryFilters: [{ field: "userId", value: userId }],
      includeOptions
    });

    return bankConnections;
  } catch (error) {
    console.log("[ERR_GET_BANK_CONNECTIONS]", error);
    throw new DefaultError("Error on fetching bank connectinos");
  }
}
