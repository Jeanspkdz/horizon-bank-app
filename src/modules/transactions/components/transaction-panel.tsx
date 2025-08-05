"use client";

import { use, useEffect, useState } from "react";
import { Heading } from "@/modules/core/components/heading";

import { SummaryCard } from "@/modules/transactions/components/summary-card";
import { Banana, CreditCard } from "lucide-react";
import { AccountBase } from "plaid";
import { formatMoney } from "@/modules/core/lib/format";
import { BankCardSelect } from "./bank-card-select";
import { BankAccount } from "@/modules/bankAccounts/types";

interface TransactionPanelProps{
  bankAccountsPromise: Promise<BankAccount[]>
}

export const TransactionPanel = ({bankAccountsPromise}: TransactionPanelProps) => {
  const bankAccounts = use(bankAccountsPromise)
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0].accountId);
  const selectedBankAccount = bankAccounts.find(bankAccount => bankAccount.accountId === bankAccountId) as BankAccount


  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <div>
          <Heading
            type="default"
            title="Transaction History"
            subtitle="Gain Insights and Track Your Transactions Over Time"
          />
        </div>

        <BankCardSelect
          bankAccounts={bankAccounts}
          value={bankAccountId}
          onValueChange={setBankAccountId}
        />
      </div>

      <div>
        <SummaryCard
          title={selectedBankAccount.name}
          name={selectedBankAccount.officialName ?? "Bank Account"}
          balance={selectedBankAccount.balance ?? 0}
          className="mt-5"
        />

        <div>
          <h2 className="font-semibold mt-5">Transaction History</h2>

          
        </div>
      </div>
    </div>
  );
};
