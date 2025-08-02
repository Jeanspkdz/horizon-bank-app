"use server"

import { plaidClient } from "@/modules/bankConnection/lib/plaid"
import { TransactionsSyncRequest } from "plaid"

interface GetBankTransactionsRequest {
  accessToken: string 
}

export async function getBankTransactions({accessToken}: GetBankTransactionsRequest) {
  const request : TransactionsSyncRequest = {
    access_token: accessToken,
  }

  const response = await plaidClient.transactionsSync(request)
  return response.data
}