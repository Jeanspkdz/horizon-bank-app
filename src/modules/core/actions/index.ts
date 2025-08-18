"use server";

import { updateBankAccountsBalanceByUser } from "@/modules/bankAccounts/actions";
import { updateBankTransactionsByUser } from "@/modules/transactions/actions";

export async function syncUserBankData(userId: string) {
  Promise.all([
    updateBankAccountsBalanceByUser(userId),
    updateBankTransactionsByUser(userId),
  ]).then(() => console.log("SYNC_FINISHED"));
}
