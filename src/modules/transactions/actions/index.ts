"use server"

import { plaidClient } from "@/modules/bankConnection/lib/plaid"
import { TransactionsSyncRequest } from "plaid"

interface GetBankTransactionsRequest {
  accessToken: string 
  accountId: string
}

export async function getBankTransactionsByAccount({accessToken, accountId}: GetBankTransactionsRequest) {
  const request : TransactionsSyncRequest = {
    access_token: accessToken,
    options: {
      account_id: accountId
    }
  }

  const response = await plaidClient.transactionsSync(request)
  return response.data
}