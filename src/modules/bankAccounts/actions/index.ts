"use server";

import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import { BankConnection } from "@/modules/bankConnection/types";
import { DefaultError } from "@/modules/core/errors";
import { createAdminClient } from "@/modules/core/lib/appwrite";
import { Response } from "@/modules/core/types";
import { Query } from "node-appwrite";
import { AccountBase } from "plaid";

const { APPWRITE_BANK_COLLECTION, APPWRITE_DB } = process.env;

export async function getBankAccounts(userId: string): Promise<AccountBase[]> {
  try {
    const bankConnections = await getBankConnectionsById(userId);
    const financialUserAccounts = await Promise.all(
      bankConnections.map((bankConnection) =>
        getBankAccount(bankConnection.accessToken)
      )
    );
    return financialUserAccounts
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNTS]", error);
    throw new DefaultError("Error on fetching bank accounts");
  }
}

export async function getBankConnectionsById(
  userId: string
): Promise<BankConnection[]> {
  try {
    const { database } = await createAdminClient();
    const documentsResponse = await database.listDocuments(
      APPWRITE_DB!!,
      APPWRITE_BANK_COLLECTION!!,
      [Query.equal("userId", userId)]
    );
    const bankConnections: BankConnection[] = documentsResponse.documents.map(
      (doc): BankConnection => ({
        id: doc.$id,
        userId: doc.userId,
        accessToken: doc.accessToken,
        itemId: doc.itemId,
        fundingSourceUrl: doc.fundingSourceUrl,
      })
    );

    return bankConnections;
  } catch (error) {
    console.log("[ERR_GET_BANK_CONNECTIONS]", error);
    throw new DefaultError("Error on fetching bank connectinos");
  }
}

export async function getBankAccount(accessToken: string) {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const account = response.data.accounts[0];

    return account;
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNT]", error);
    throw new DefaultError("Error on fetching bank account");
  }
}
