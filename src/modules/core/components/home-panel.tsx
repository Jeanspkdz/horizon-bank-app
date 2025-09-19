import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { getBankAccountsByUser } from "@/modules/bankAccounts/actions";
import { DoughnutChart } from "@/modules/core/components/doughnut-chart";
import { Heading } from "@/modules/core/components/heading";
import { RightSidebar } from "@/modules/core/components/right-sidebar";
import { getBankTransactionsByAccount } from "@/modules/transactions/actions";
import { TransactionsTab } from "./transactions-tab";
import { Transaction } from "@/modules/transactions/types";

export const HomePanel = async () => {
  const response = await getLoggedInUser();

  if (!response.success) {
    throw response.error;
  }
  const user = response.data;

  const bankAccounts = await getBankAccountsByUser({
    userId: user.id,
  });

  const transactions = await Promise.all(
    bankAccounts.map(async (bankAccount) => {
      return getBankTransactionsByAccount({
        bankAccountId: bankAccount.id,
        includeOptions: {
          bankAccount: true,
        },
        pagOptions: {
          limit: 7
        }
      });
    })
  );
  const transactionsFlatted = transactions.flat(1);
  console.log("FLATTED", transactionsFlatted);
  
  let transactionsGrouped = Object.groupBy(
    transactionsFlatted,
    (tr) => tr.bankAccount.name
  ) as Record<string, Transaction[]>;

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 p-5">
        <div className="mb-8">
          <Heading
            type="greeting"
            title="Welcome"
            subtitle="Access and manage your account and transactions efficiently"
            name={`${user?.firstName} ${user?.lastName}`}
          />
        </div>

        <div>
          <DoughnutChart
            data={bankAccounts}
            dataKey={"balance"}
            nameKey={"name"}
          />
        </div>

        <div className="mt-8">
          <TransactionsTab
            transactions={transactionsGrouped}
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <RightSidebar
          bankAccounts={bankAccounts}
          email={user!.email}
          username={`${user?.firstName} ${user?.lastName}`}
          transactions={transactionsFlatted}
        />
      </div>
    </div>
  );
};
