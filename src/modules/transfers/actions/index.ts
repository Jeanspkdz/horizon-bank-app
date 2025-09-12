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
    console.log("NOTE", note);
    

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
    console.log("TRANSFER_RESPONSE!!!", response.headers.get("location"));
  } catch (error) {
    console.log("[ERR_MAKE_TRANSFER]", error);
  }
}
