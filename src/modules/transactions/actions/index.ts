"use server";

import {
  getCursorByBankAccount,
  updateCursorByBankAccount,
} from "@/modules/bankAccounts/actions";
import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import { createAdminClient } from "@/modules/core/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { TransactionsSyncRequest } from "plaid";
import {
  Transaction,
  TransactionCreateInput,
  TransactionId,
  TransactionUpdateInput,
} from "@/modules/transactions/types";
import { isPlaidError } from "@/modules/core/lib/plaid";

const { APPWRITE_DB, APPWRITE_TRANSACTION_COLLECTION } = process.env;

interface UpdateBankTransactionsByAccountRequest {
  accessToken: string;
  accountId: string;
  id: string;
}
export async function updateBankTransactionsByAccount({
  accessToken,
  id,
  accountId,
}: UpdateBankTransactionsByAccountRequest) {
  //Get the cursor from the last sync
  let cursor = await getCursorByBankAccount(id);
  let tempCursor = cursor;
  let hasMore: boolean = true;

  while (hasMore) {
    try {
      const data = await getBankTransactionsByAccountFromPlaid({
        accessToken,
        accountId,
        cursor,
      });

      const { added, modified, removed, next_cursor, has_more } = data;

      const addedTransactions: TransactionCreateInput[] = added.map(
        (transaction) => ({
          amount: transaction.amount,
          status: transaction.pending ? "pending" : "success",
          category: transaction.personal_finance_category?.primary || "other",
          merchantName: transaction.merchant_name ?? "other",
          merchantLogoUrl: transaction.logo_url ?? "",
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
          merchantLogoUrl: transaction.logo_url || "",
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
  const { database } = await createAdminClient();

  // const response = await database.createDocuments() // Bulk create is not supported for collections with relationship
  await Promise.all(
    transactions.map(async (transaction) => {
      const documents = await database.createDocument(
        APPWRITE_DB!!,
        APPWRITE_TRANSACTION_COLLECTION!!,
        ID.unique(),
        { ...transaction }
      );
    })
  );

  console.log("Finishing Creating transactions!!!!");
}

async function updateBankTransactions(
  transactionUpdateMap: Record<string, TransactionUpdateInput>
) {
  console.log("Updating transactions!!!!");

  const { database } = await createAdminClient();

  const a = await Promise.all(
    Object.entries(transactionUpdateMap).map(
      async ([externalTransactionId, value]) => {
        const { documents } = await database.listDocuments(
          APPWRITE_DB!!,
          APPWRITE_TRANSACTION_COLLECTION!!,
          [Query.equal("externalTransactionId", externalTransactionId)]
        );
        const document = documents[0];

        const updatedDocument = await database.updateDocument(
          APPWRITE_DB!!,
          APPWRITE_TRANSACTION_COLLECTION!!,
          document.$id,
          { ...value }
        );
      }
    )
  );
  console.log("Finishing Updating transactions!!!!");
}

async function deleteBankTransactions(deletedTransactionIds: TransactionId[]) {
  console.log("Deleting transactions!!!!");

  const { database } = await createAdminClient();

  await Promise.all(
    deletedTransactionIds.map(async (deleteBankTransactionId) => {
      const { documents } = await database.listDocuments(
        APPWRITE_DB!!,
        APPWRITE_TRANSACTION_COLLECTION!!,
        [Query.equal("externalTransactionId", deleteBankTransactionId)]
      );

      const document = documents[0];

      await database.deleteDocument(
        APPWRITE_DB!!,
        APPWRITE_TRANSACTION_COLLECTION!!,
        document.$id
      );
    })
  );

  console.log("Finishing Deleting transactions!!!!");
}

export async function getBankTransactionsByAccount(bankAccountId: string) {
  const { database } = await createAdminClient();

  const { documents } = await database.listDocuments(
    APPWRITE_DB!!,
    APPWRITE_TRANSACTION_COLLECTION!!,
    [Query.equal("bankAccountId", bankAccountId)]
  );

  const transactions: Transaction[] = documents.map(
    (doc): Transaction => ({
      id: doc["$id"],
      amount: doc["amount"],
      status: doc["status"],
      category: doc["category"],
      merchantName: doc["merchantName"],
      merchantLogoUrl: doc["merchantLogoUrl"],
      datetime: doc["datetime"],
      bankAccountId: doc["bankAccountId"],
      externalTransactionId: doc["externalTransactionId"],
    })
  );

  return transactions
}
