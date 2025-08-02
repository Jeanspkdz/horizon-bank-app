"use client";

import { use, useState } from "react";
import { Heading } from "@/modules/core/components/heading";

import { SummaryCard } from "@/modules/transactions/components/summary-card";
import { Banana, CreditCard } from "lucide-react";
import { AccountBase } from "plaid";
import { formatMoney } from "@/modules/core/lib/format";
import { BankCardSelect } from "./bank-card-select";

interface TransactionPanelProps{
  bankAccountsPromise: Promise<AccountBase[]>
}


export const TransactionPanel = ({bankAccountsPromise}: TransactionPanelProps) => {
  const bankAccounts = use(bankAccountsPromise)
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0].account_id);
  const selectedBankAccount = bankAccounts.find(bankAccount => bankAccount.account_id === bankAccountId) as AccountBase
  

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
          name={selectedBankAccount.official_name ?? "Bank Account"}
          balance={selectedBankAccount.balances.available ?? 0}
          className="mt-5"
        />

        <div>
          <h2 className="font-semibold mt-5">Transaction History</h2>
        </div>
      </div>
    </div>
  );
};
