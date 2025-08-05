"use server"

import { createAdminClient } from "@/modules/core/lib/appwrite";
import {
  BankConnection,
  BankConnectionCreateInput,
} from "@/modules/bankConnection/types";
import { ID, Query } from "node-appwrite";
import { DefaultError } from "@/modules/core/errors";

const { APPWRITE_DB, APPWRITE_BANK_CONNECTION_COLLECTION } = process.env;

export async function createBankConnection(
  bankConnection: BankConnectionCreateInput
): Promise<BankConnection> {
  try {
    const { database } = await createAdminClient();
    const documentCreated = await database.createDocument(
      APPWRITE_DB!!,
      APPWRITE_BANK_CONNECTION_COLLECTION!!,
      ID.unique(),
      bankConnection
    );

    const bankConnectionCreated : BankConnection = {
      id: documentCreated.$id,
      userId: documentCreated["userId"],
      accessToken: documentCreated["accessToken"],
      itemId: documentCreated["itemId"],
    }

    return bankConnectionCreated;
  } catch (error) {
    console.log("[ERR_CREATE_BANK_ACCOUNT]", error);
    throw new DefaultError("Error creating bank account");
  }
}


export async function getBankConnectionsByUserId(
  userId: string
): Promise<BankConnection[]> {
  try {
    const { database } = await createAdminClient();
    const documentsResponse = await database.listDocuments(
      APPWRITE_DB!!,
      APPWRITE_BANK_CONNECTION_COLLECTION!!,
      [Query.equal("userId", userId)]
    );
    const bankConnections: BankConnection[] = documentsResponse.documents.map(
      (doc): BankConnection => ({
        id: doc.$id,
        userId: doc.userId,
        accessToken: doc.accessToken,
        itemId: doc.itemId,
      })
    );

    return bankConnections;
  } catch (error) {
    console.log("[ERR_GET_BANK_CONNECTIONS]", error);
    throw new DefaultError("Error on fetching bank connectinos");
  }
}