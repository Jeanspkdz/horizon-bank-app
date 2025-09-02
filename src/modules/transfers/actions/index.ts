"use server";

import {
  getBankAccount,
  getBankAccountById,
} from "@/modules/bankAccounts/actions";
import { dwollaClient } from "@/modules/bankConnection/lib/dwolla";

interface MakeTransferParams {
  senderBankAccountId: string;
  note?: string;
  receiverEmail: string;
  shareableId: string;
  amount: number;
}

export async function makeTransfer({
  senderBankAccountId,
  shareableId,
  note,
  amount,
  receiverEmail,
}: MakeTransferParams) {
  try {
    const senderBankAcccount = await getBankAccountById(senderBankAccountId);
    console.log("SENDER", senderBankAcccount);

    const [receiverBankAccount] = await getBankAccount({
      queryFilters: [
        { field: "shareableId", value: shareableId, operator: "equal" },
      ],
      // includeOptions: {
      //   bankConnection: true
      // }
    });
    console.log("RECEIVER", receiverBankAccount);

    //TODO: Validate email

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
      metadata: {
        note,
      },
    };

    const response = await dwollaClient.post("/transfers", requestBody);
    console.log("TRASNFER_RESPONSE!!!", response.headers.get("location"));
  } catch (error) {
    console.log("[ERR_MAKE_TRASNFER]", error);
  }
}
