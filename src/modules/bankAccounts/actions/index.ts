"use server";

import {
  BankAccount,
  BankAccountCreateInput,
  BankAccountIncludeOptions,
  BankAccountUpdateInput,
} from "@/modules/bankAccounts/types";
import { getBankConnectionsByUserId } from "@/modules/bankConnection/actions/bank-connection";
import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import { BankConnection } from "@/modules/bankConnection/types";
import { createAdminClient } from "@/modules/core/actions/appwrite";
import { DefaultError } from "@/modules/core/errors";
import {
  buildIncludeOptions,
  buildQueryFilters,
} from "@/modules/core/lib/query-builders";
import { ModelIncludeOptions, ModelQueryFilters } from "@/modules/core/types";
import { ID, Query } from "node-appwrite";
import { mapToBankAccount } from "../mappers";

const { APPWRITE_DB, APPWRITE_BANK_ACCOUNT_COLLECTION } = process.env;

export async function getBankAccount<
  T extends ModelQueryFilters<BankAccount>[],
  const K extends ModelIncludeOptions["BankAccount"]
>({ queryFilters, includeOptions }: { queryFilters: T; includeOptions?: K }) {
  const { tableDB } = await createAdminClient();

  const builtQueryFilters = buildQueryFilters(queryFilters);
  const builtIncludeOptions = buildIncludeOptions(includeOptions);

  const { rows } = await tableDB.listRows({
    databaseId: APPWRITE_DB!!,
    tableId: APPWRITE_BANK_ACCOUNT_COLLECTION!!,
    queries: [...builtQueryFilters, builtIncludeOptions],
  });

  const bankAccounts = rows.map((row) => mapToBankAccount(row, includeOptions));

  return bankAccounts;
}

export async function getBankAccountsByBankConnection<
  IOptions extends BankAccountIncludeOptions
>(args: { bankConnectionId: string; includeOptions?: IOptions }) {
  try {
    const bankAccounts = await getBankAccount({
      queryFilters: [
        {
          field: "bankConnectionId",
          value: args.bankConnectionId,
        },
      ],
      includeOptions: args.includeOptions,
    });

    return bankAccounts;
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNT_BY_BANK_CONNECTION]", error);
    throw new DefaultError("Error on fetching bank account");
  }
}

export async function getBankAccountsByUser<
  T extends BankAccountIncludeOptions
>({ userId, include }: { userId: string; include?: T }) {
  try {
    const bankConnections = await getBankConnectionsByUserId({
      userId,
    });
    const financialUserBankAccounts = await Promise.all(
      bankConnections.map((bankConnection: BankConnection) =>
        getBankAccountsByBankConnection({
          bankConnectionId: bankConnection.id,
          includeOptions: include,
        })
      )
    );

    return financialUserBankAccounts.flat(1);
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNTS]", error);
    throw new DefaultError("Error on fetching bank accounts");
  }
}

export async function updateBankAccountsBalanceByUser(userId: string) {
  try {
    const bankConnections = await getBankConnectionsByUserId({
      userId,
    });

    for (const bankConnection of bankConnections) {
      const [bankAccounts, response] = await Promise.all([
        getBankAccountsByBankConnection({
          bankConnectionId: bankConnection.id,
          includeOptions: { bankConnection: true },
        }),
        plaidClient.accountsBalanceGet({
          access_token: bankConnection.accessToken,
        }),
      ]);

      const accounts = response.data.accounts;

      // Update balance on each account
      await Promise.all(
        accounts.map((account) => {
          const bankAccountMatched = bankAccounts.find(
            (bankAccount) => bankAccount.externalAccountId == account.account_id
          );

          if (bankAccountMatched == null) return Promise.resolve();

          return updateBankAccount({
            id: bankAccountMatched.id,
            data: {
              balance:
                account.balances.available ?? account.balances.current ?? 0,
            },
          });
        })
      );
    }
  } catch (error) {
    console.log("[ERR_UPDATE_BANK_ACCOUNTS_BALANCE]", error);
    throw new DefaultError("Error on updating balance");
  }
}

interface UpdateBankAccountRequest {
  id: string;
  data: BankAccountUpdateInput;
}
export async function updateBankAccount({
  id,
  data,
}: UpdateBankAccountRequest) {
  try {
    const { tableDB } = await createAdminClient();
    const updatedRow = await tableDB.updateRow({
      databaseId: APPWRITE_DB!!,
      tableId: APPWRITE_BANK_ACCOUNT_COLLECTION!!,
      rowId: id,
      data,
    });
  } catch (error) {
    console.log("[ERR_UPDATE_BANK_ACCOUNT]", error);
    throw new DefaultError("Error creating bank account");
  }
}

export async function createBankAccount(bankAccount: BankAccountCreateInput) {
  try {
    const { tableDB } = await createAdminClient();

    const createdRow = await tableDB.createRow({
      databaseId: APPWRITE_DB!!,
      tableId: APPWRITE_BANK_ACCOUNT_COLLECTION!!,
      rowId: ID.unique(),
      data: { ...bankAccount, shareableId: crypto.randomUUID() },
    });
  } catch (error) {
    console.log("[ERR_CREATE_BANK_ACCOUNT]", error);
    throw new DefaultError("Error creating bank account");
  }
}

export async function getBankAccountsFromPlaid(accessToken: string) {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accounts = response.data.accounts;

    return accounts;
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNT]", error);
    throw new DefaultError("Error on fetching bank account");
  }
}

//Function Overload
// export async function getBankAccountsByBankConnection(
//   params: { bankConnectionId: string }
// ): Promise<BankAccount[]>;
// export async function getBankAccountsByBankConnection(
//    params: { bankConnectionId: string; include: { bankConnection: boolean } }
// ): Promise<BankAccountWithBankConnection[]>;

export async function getBankAccountById(id: string) {
  const { tableDB } = await createAdminClient();
  const row = await tableDB.getRow({
    databaseId: APPWRITE_DB!!,
    tableId: APPWRITE_BANK_ACCOUNT_COLLECTION!!,
    rowId: id,
    queries: [Query.select(["*"])],
  });

  return mapToBankAccount(row, { bankConnection: false });
}

export async function getCursorByBankAccount(
  accountId: string
): Promise<string | null> {
  const { database, tableDB } = await createAdminClient();

  const response = await tableDB.getRow({
    databaseId: APPWRITE_DB!!,
    tableId: APPWRITE_BANK_ACCOUNT_COLLECTION!!,
    rowId: accountId,
  });

  return response["transactionCursor"];
}

export async function updateCursorByBankAccount(
  accountId: string,
  cursor: string
): Promise<string | null> {
  const { database, tableDB } = await createAdminClient();

  const response = await tableDB.updateRow({
    databaseId: APPWRITE_DB!!,
    tableId: APPWRITE_BANK_ACCOUNT_COLLECTION!!,
    rowId: accountId,
    data: { transactionCursor: cursor },
  });

  return response["transactionCursor"];
}
