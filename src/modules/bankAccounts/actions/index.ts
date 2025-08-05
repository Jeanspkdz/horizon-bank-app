"use server";

import {
  BankAccount,
  BankAccountCreateInput,
  BankAccountUpdateInput,
} from "@/modules/bankAccounts/types";
import { getBankConnectionsByUserId } from "@/modules/bankConnection/actions/bank-connection";
import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import { BankConnection } from "@/modules/bankConnection/types";
import { DefaultError } from "@/modules/core/errors";
import { createAdminClient } from "@/modules/core/lib/appwrite";
import { ID, Query } from "node-appwrite";

const { APPWRITE_DB, APPWRITE_BANK_ACCOUNT_COLLECTION } = process.env;

export async function getBankAccounts(userId: string): Promise<BankAccount[]> {
  try {
    const bankConnections = await getBankConnectionsByUserId(userId);
    const financialUserBankAccounts = await Promise.all(
      bankConnections.map((bankConnection: BankConnection) =>
        getBankAccountsByBankConnection(bankConnection.id)
      )
    );

    return financialUserBankAccounts.flat(2);
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNTS]", error);
    throw new DefaultError("Error on fetching bank accounts");
  }
}

export async function updateBankAccountBalanceByUser(userId: string) {
  try {
    //Get BankConnectionByUser
  const bankConnections = await getBankConnectionsByUserId(userId);

  for (const bankConnection of bankConnections) {
     const [bankAccounts, response] = await Promise.all([
        getBankAccountsByBankConnection(bankConnection.id),
        plaidClient.accountsBalanceGet({ access_token: bankConnection.accessToken })
      ]);

    const accounts = response.data.accounts;

    // Update balance on each account
    await Promise.all(
      accounts.map((account) => {
        const bankAccountMatched = bankAccounts.find(
          (bankAccount) => bankAccount.accountId == account.account_id
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
async function updateBankAccount({ id, data }: UpdateBankAccountRequest) {
  try {
    const { database } = await createAdminClient();
    const documentCreated = await database.updateDocument(
      APPWRITE_DB!!,
      APPWRITE_BANK_ACCOUNT_COLLECTION!!,
      id,
      data
    );

    const bankAccountUpdated: BankAccount = {
      id: documentCreated.$id, // Usamos el id generado por Appwrite
      accountId: documentCreated.accountId,
      fundingSourceUrl: documentCreated.fundingSourceUrl,
      name: documentCreated.name,
      officialName: documentCreated.officialName,
      type: documentCreated.type,
      subtype: documentCreated.subtype,
      balance: documentCreated.balance, // TODO : Update in DB
      bankConnectionId: documentCreated.bankConnectionId,
    };

    return bankAccountUpdated;
  } catch (error) {
    console.log("[ERR_UPDATE_BANK_ACCOUNT]", error);
    throw new DefaultError("Error creating bank account");
  }
}

export async function createBankAccount(
  bankAccount: BankAccountCreateInput
): Promise<BankAccount> {
  try {
    const { database } = await createAdminClient();
    const documentCreated = await database.createDocument(
      APPWRITE_DB!!,
      APPWRITE_BANK_ACCOUNT_COLLECTION!!,
      ID.unique(),
      bankAccount
    );

    const bankAccountCreated: BankAccount = {
      id: documentCreated.$id, // Usamos el id generado por Appwrite
      accountId: documentCreated.accountId,
      fundingSourceUrl: documentCreated.fundingSourceUrl,
      name: documentCreated.name,
      officialName: documentCreated.officialName,
      type: documentCreated.type,
      subtype: documentCreated.subtype,
      balance: documentCreated.balance, // TODO : Update in DB
      bankConnectionId: documentCreated.bankConnectionId,
    };

    return bankAccountCreated;
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

export async function getBankAccountsByBankConnection(
  bankConnectionId: string
): Promise<BankAccount[]> {
  try {
    const { database } = await createAdminClient();
    const documentsList = await database.listDocuments(
      APPWRITE_DB!!,
      APPWRITE_BANK_ACCOUNT_COLLECTION!!,
      [Query.equal("bankConnectionId", bankConnectionId)]
    );
    const bankAccountsDocuments = documentsList.documents;
    const bankAccounts = bankAccountsDocuments.map((account) => {
      const bankAccount: BankAccount = {
        id: account["$id"],
        accountId: account["accountId"],
        name: account["name"],
        officialName: account["officialName"],
        type: account["type"],
        subtype: account["subtype"],
        balance: account["balance"],
        fundingSourceUrl: account["fundingSourceUrl"],
        bankConnectionId: account["bankConnectionId"],
      };
      return bankAccount;
    });

    return bankAccounts;
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNT_BY_BANK_CONNECTIOIN]", error);
    throw new DefaultError("Error on fetching bank account");
  }
}
