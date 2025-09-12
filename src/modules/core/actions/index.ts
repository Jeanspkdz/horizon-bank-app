"use server";

import { updateBankAccountsBalanceByUser } from "@/modules/bankAccounts/actions";
import { updateBankTransactionsByUser } from "@/modules/transactions/actions";
import { Response } from "../types";
import { PlaidReconnectionError } from "../errors";

export async function syncUserBankData(
  userId: string
): Promise<Response<null>> {
  try {
    await Promise.all([
      updateBankAccountsBalanceByUser(userId),
      updateBankTransactionsByUser(userId),
    ]);

    return {
      data: null,
      success: true
    }
  } catch (error) {
    console.log("SYNC_USER_BANK", error);
    
    if(error instanceof PlaidReconnectionError){
      return {
        success: false,
        error: error,
      }
    }

    throw error
  }
}
