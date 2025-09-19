import { TransactionsTable } from "@/modules/transactions/components/transaction-table";
import { Transaction } from "@/modules/transactions/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TransactionsTabProps {
  transactions: Record<string, Transaction[]>;
}

export const TransactionsTab = ({ transactions }: TransactionsTabProps) => {
  const transactionsName = Object.keys(transactions);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>

      <Tabs defaultValue={transactionsName[0]}>
        <TabsList className="bg-transparent flex flex-wrap gap-y-2">
          {transactionsName.map((name) => (
            <TabsTrigger
              value={name}
              key={name}
              className="data-[state=active]:border-b-2 data-[state=active]:border-b-brand-blue data-[state=active]:text-brand-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-4"
            >
              {name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(transactions).map(([key, value], index) => (
          <TabsContent value={key} key={index} className="mt-6">
            <TransactionsTable data={value} showFull={false} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};
