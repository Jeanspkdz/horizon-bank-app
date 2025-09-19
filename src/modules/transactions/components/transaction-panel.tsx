"use client";

import { Heading } from "@/modules/core/components/heading";
import { use, useEffect, useState } from "react";

import { BankAccount } from "@/modules/bankAccounts/types";
import { BankConnection } from "@/modules/bankConnection/types";
import { SummaryCard } from "@/modules/transactions/components/summary-card";
import { BankCardSelect } from "../../core/components/bank-card-select";
import {
  getBankTransactionsByAccount
} from "../actions";
import { Transaction } from "../types";
import { TransactionTableSkeleton } from "./transaction-table/transaction-table-skeleton";
import { TransactionsTable } from "./transaction-table";

interface TransactionPanelProps {
  bankAccountsPromise: Promise<
    (BankAccount & { bankConnection: BankConnection })[]
  >;
}

export const TransactionPanel = ({
  bankAccountsPromise,
}: TransactionPanelProps) => {
  const bankAccounts = use(bankAccountsPromise);
  
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0].id);

  const selectedBankAccount = bankAccounts.find(
    (bankAccount) => bankAccount.id === bankAccountId
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedBankAccount == null) return;

    let isCancelled = false;

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        if (isCancelled) return;
        const transactions = await getBankTransactionsByAccount(
         {
          bankAccountId:  selectedBankAccount.id
         }
        );

        if (!isCancelled) {
          setTransactions(transactions);
        }
      } catch (error) {
        console.log("[ERR_FETCHING_TRANSACTIONS]", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();

    return () => {
      isCancelled = false;
    };
  }, [bankAccountId]);

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
          title={selectedBankAccount?.name ?? "Unknown"} 
          name={selectedBankAccount?.officialName ?? "Bank Account"}
          balance={selectedBankAccount?.balance ?? 0}
          className="mt-5"
        />

        <div>
          <h2 className="font-semibold my-5">Transaction History</h2>

          {isLoading ? (
            <TransactionTableSkeleton />
          ) : (
            <TransactionsTable data={transactions} />
          )}
        </div>
      </div>
    </div>
  );
};
