"use client";

import { Heading } from "@/modules/core/components/heading";
import { use, useEffect, useState } from "react";

import {
  BankAccount,
  BankAccountWithInclude,
} from "@/modules/bankAccounts/types";
import { SummaryCard } from "@/modules/transactions/components/summary-card";
import { BankCardSelect } from "./bank-card-select";
import { getBankTransactionsByAccount } from "../actions";
import { BankConnection } from "@/modules/bankConnection/types";

interface TransactionPanelProps {
  bankAccountsPromise: Promise<
    (BankAccount & { bankConnection: BankConnection })[]
  >;
}

export const TransactionPanel = ({
  bankAccountsPromise,
}: TransactionPanelProps) => {
  const bankAccounts = use(bankAccountsPromise);
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0].accountId);
  const selectedBankAccount = bankAccounts.find(
    (bankAccount) => bankAccount.accountId === bankAccountId
  )!!!!;

  const [isLoading, setIsLoading] = useState(false);

  console.log(selectedBankAccount);

  useEffect(() => {

    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const transactions = await getBankTransactionsByAccount({
          accessToken: selectedBankAccount.bankConnection.accessToken,
          accountId: selectedBankAccount.accountId,
        });
        console.log("Transactions:" ,transactions)
      } catch (error) {
        console.log("[ERR_FETCHING_TRANSACTIOS]", error )
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();

  }, [bankAccountId, selectedBankAccount]);

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

          {isLoading ? (
            <p>Loading....</p>
          ) : (
            <div>
              Transactions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
