"use server";

import {
  getBankAccount,
  getBankAccountById,
} from "@/modules/bankAccounts/actions";
import { dwollaClient } from "@/modules/bankConnection/lib/dwolla";
import { DefaultError } from "@/modules/core/errors";
import { Response } from "@/modules/core/types";

interface MakeTransferParams {
  senderBankAccountId: string;
  note?: string;
  shareableId: string;
  amount: number;
}

export async function makeTransfer({
  senderBankAccountId,
  shareableId,
  amount,
}: MakeTransferParams) : Promise<Response<string>> {
  try {
    const senderBankAcccount = await getBankAccountById(senderBankAccountId);
    console.log("SENDER", senderBankAcccount);

    const [receiverBankAccount] = await getBankAccount({
      queryFilters: [
        { field: "shareableId", value: shareableId, operator: "equal" },
      ],
    });
    console.log("RECEIVER", receiverBankAccount);

    const requestBody = {
      _links: {
        source: {
          href: senderBankAcccount.fundingSourceUrl,
        },
        destination: {
          href: receiverBankAccount.fundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount.toString(),
      },
    };

    const response = await dwollaClient.post("transfers", requestBody);
    const transactionLocation = response.headers.get("location");

    if(transactionLocation == null) throw new DefaultError("Error on transaction")

    return {
      success: true,
      data: transactionLocation
    }
  } catch (error) {
    console.log("[ERR_MAKE_TRANSFER]", error);
    return {
      success: false,
      error: new DefaultError("Error on transaction")
    }
  }
}
