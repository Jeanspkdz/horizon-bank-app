"use server";

import {
  getBankAccountsByUser,
  getCursorByBankAccount,
  updateCursorByBankAccount,
} from "@/modules/bankAccounts/actions";
import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import { createAdminClient } from "@/modules/core/actions/appwrite";
import { isPlaidError } from "@/modules/core/lib/plaid";
import {
  buildIncludeOptions,
  buildQueryFilters,
} from "@/modules/core/lib/query-builders";
import { ModelIncludeOptions, ModelQueryFilters } from "@/modules/core/types";
import {
  BankTransactionIncludeOptions,
  Transaction,
  TransactionCreateInput,
  TransactionId,
  TransactionUpdateInput,
} from "@/modules/transactions/types";
import { ID, Query } from "node-appwrite";
import { TransactionsSyncRequest } from "plaid";
import { mapToBankTransaction } from "../mappers";

const { APPWRITE_DB, APPWRITE_TRANSACTION_COLLECTION } = process.env;

interface UpdateBankTransactionsByAccountRequest {
  accessToken: string;
  externalAccountId: string;
  id: string;
}
export async function updateBankTransactionsByAccount({
  accessToken,
  id,
  externalAccountId,
}: UpdateBankTransactionsByAccountRequest) {
  //Get the cursor from the last sync
  let cursor = await getCursorByBankAccount(id);
  let tempCursor = cursor;
  let hasMore: boolean = true;

  while (hasMore) {
    try {
      const data = await getBankTransactionsByAccountFromPlaid({
        accessToken,
        accountId: externalAccountId,
        cursor,
      });

      const { added, modified, removed, next_cursor, has_more } = data;

      const addedTransactions: TransactionCreateInput[] = added.map(
        (transaction) => ({
          amount: transaction.amount,
          status: transaction.pending ? "pending" : "success",
          category: transaction.personal_finance_category?.primary || "other",
          merchantName:
            transaction.merchant_name ??
            cleanTransactionName(transaction.name) ??
            "other",
          merchantLogoUrl:
            transaction.logo_url ??
            transaction.personal_finance_category_icon_url ??
            null,
          datetime: transaction.date,
          bankAccountId: id,
          externalTransactionId: transaction.transaction_id,
        })
      );

      const updatedTransactions: Record<string, TransactionUpdateInput> = {};
      modified.forEach((transaction) => {
        updatedTransactions[transaction.transaction_id] = {
          amount: transaction.amount,
          status: transaction.pending ? "pending" : "success",
          category: transaction.personal_finance_category?.primary || "other",
          merchantLogoUrl: transaction.logo_url || null,
          datetime: transaction.date,
        };
      });

      const deletedTransactionsIds = removed.map(
        (removedTransaction) => removedTransaction.transaction_id
      );

      // Handle transactions in DB
      await Promise.all([
        createBankTransactions(addedTransactions),
        updateBankTransactions(updatedTransactions),
        deleteBankTransactions(deletedTransactionsIds),
      ]);

      // Update controllers
      hasMore = has_more;
      tempCursor = cursor;
      cursor = next_cursor;
    } catch (error) {
      if (
        isPlaidError(error) &&
        error.response?.data?.error_code ===
          "TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION"
      ) {
        cursor = tempCursor;
        hasMore = true;
        continue; //Retry using the temporal cursor
      } else {
        throw error;
      }
    }
  }

  //Store cursor in bank account
  if (cursor !== null) {
    await updateCursorByBankAccount(id, cursor);
  }
}

export async function updateBankTransactionsByUser(userId: string) {
  // Get bankAccoutns from user
  const bankAccounts = await getBankAccountsByUser({
    userId,
    include: {
      bankConnection: true,
    },
  });
  // For each bankAccount update its transactions
  Promise.all(
    bankAccounts.map(async (bankAccount) => {
      return await updateBankTransactionsByAccount({
        id: bankAccount.id,
        externalAccountId: bankAccount.externalAccountId,
        accessToken: bankAccount.bankConnection.accessToken,
      });
    })
  );
}

interface GetBankTransactionsRequest {
  accessToken: string;
  accountId: string;
  cursor: string | null;
}
async function getBankTransactionsByAccountFromPlaid({
  accessToken,
  accountId,
  cursor,
}: GetBankTransactionsRequest) {
  const request: TransactionsSyncRequest = {
    access_token: accessToken,
    cursor: cursor ?? undefined,
    options: {
      account_id: accountId,
    },
  };

  const response = await plaidClient.transactionsSync(request);
  return response.data;
}

async function createBankTransactions(transactions: TransactionCreateInput[]) {
  console.log("Starting Creating transactions!!!!");
  console.log(transactions);
  const { tableDB } = await createAdminClient();

  // const response = await database.createDocuments() // Bulk create is not supported for collections with relationship
  await Promise.all(
    transactions.map(async (transaction) => {
      const response = await tableDB.createRow({
        databaseId: APPWRITE_DB!!,
        tableId: APPWRITE_TRANSACTION_COLLECTION!!,
        rowId: ID.unique(),
        data: { ...transaction },
      });
    })
  );

  console.log("Finishing Creating transactions!!!!");
}

async function updateBankTransactions(
  transactionUpdateMap: Record<string, TransactionUpdateInput>
) {
  console.log("Updating transactions!!!!");

  const { tableDB } = await createAdminClient();

  const responses = await Promise.all(
    Object.entries(transactionUpdateMap).map(
      async ([externalTransactionId, value]) => {
        const { rows } = await tableDB.listRows({
          databaseId: APPWRITE_DB!!,
          tableId: APPWRITE_TRANSACTION_COLLECTION!!,
          queries: [
            Query.equal("externalTransactionId", externalTransactionId),
          ],
        });

        const row = rows[0];

        const updatedRow = await tableDB.updateRow({
          databaseId: APPWRITE_DB!!,
          tableId: APPWRITE_TRANSACTION_COLLECTION!!,
          rowId: row.$id,
          data: { ...value },
        });
      }
    )
  );
  console.log("Finishing Updating transactions!!!!");
}

async function deleteBankTransactions(deletedTransactionIds: TransactionId[]) {
  console.log("Deleting transactions!!!!");

  const { tableDB } = await createAdminClient();

  await Promise.all(
    deletedTransactionIds.map(async (deleteBankTransactionId) => {
      const { rows } = await tableDB.listRows({
        databaseId: APPWRITE_DB!!,
        tableId: APPWRITE_TRANSACTION_COLLECTION!!,
        queries: [
          Query.equal("externalTransactionId", deleteBankTransactionId),
        ],
      });

      const row = rows[0];

      await tableDB.deleteRow({
        databaseId: APPWRITE_DB!!,
        tableId: APPWRITE_TRANSACTION_COLLECTION!!,
        rowId: row.$id,
      });
    })
  );

  console.log("Finishing Deleting transactions!!!!");
}

export async function getBankTransactions<
  QFilters extends ModelQueryFilters<Transaction>[],
  IOptions extends ModelIncludeOptions["Transaction"]
>({
  queryFilters,
  includeOptions,
}: {
  queryFilters: QFilters;
  includeOptions?: IOptions;
}) {
  const { tableDB } = await createAdminClient();

  const builtQueryFilters = buildQueryFilters(queryFilters);
  const builtIncludeOptions = buildIncludeOptions(includeOptions);

  const { rows } = await tableDB.listRows({
    databaseId: APPWRITE_DB!!,
    tableId: APPWRITE_TRANSACTION_COLLECTION!!,
    queries: [...builtQueryFilters, builtIncludeOptions],
  });

  const bankConnections = rows.map((row) =>
    mapToBankTransaction(row, includeOptions)
  );

  return bankConnections;
}

export async function getBankTransactionsByAccount<
  IOptions extends BankTransactionIncludeOptions
>({
  bankAccountId,
  includeOptions,
}: {
  bankAccountId: string;
  includeOptions?: IOptions;
}) {
  const bankTransactions = await getBankTransactions({
    queryFilters: [
      {
        field: "bankAccountId",
        value: bankAccountId,
        operator: "equal",
      },
    ],
    includeOptions,
  });

  return bankTransactions;
}
