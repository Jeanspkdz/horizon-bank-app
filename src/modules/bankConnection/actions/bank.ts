import { createAdminClient } from "@/modules/core/lib/appwrite";
import {
  BankConnection,
  BankConnectionCreateInput,
} from "@/modules/bankConnection/types";
import { ID } from "node-appwrite";
import { DefaultError } from "@/modules/core/errors";

const { APPWRITE_DB, APPWRITE_BANK_COLLECTION } = process.env;

export async function createBankConnection(
  bankConnection: BankConnectionCreateInput
): Promise<BankConnection> {
  try {
    const { database } = await createAdminClient();
    const documentCreated = await database.createDocument(
      APPWRITE_DB!!,
      APPWRITE_BANK_COLLECTION!!,
      ID.unique(),
      bankConnection
    );

    const bankConnectionCreated : BankConnection = {
      id: documentCreated.$id,
      userId: documentCreated["userId"],
      accessToken: documentCreated["accessToken"],
      itemId: documentCreated["itemId"],
      fundingSourceUrl: documentCreated["fundingSourceUrl"],  
    }

    return bankConnectionCreated;
  } catch (error) {
    console.log("[ERR_CREATE_BANK_ACCOUNT]", error);
    throw new DefaultError("Error creating bank account");
  }
}
