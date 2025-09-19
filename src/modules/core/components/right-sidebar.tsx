import { getUserInitials } from "@/modules/auth/lib/util";
import { BankAccount } from "@/modules/bankAccounts/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/modules/core/components/ui/avatar";
import { Button } from "@/modules/core/components/ui/button";
import { Transaction } from "@/modules/transactions/types";
import { Plus } from "lucide-react";
import { Category, CategoryCountBar } from "./category-count-bar";
import { CreditCard } from "./credit-card";

interface RightSidebarProps {
  username: string;
  email: string;
  bankAccounts: BankAccount[];
  transactions: Transaction[];
}

export const RightSidebar = ({
  username,
  email,
  bankAccounts,
  transactions,
}: RightSidebarProps) => {
  const transactionsByCategories = Object.groupBy(
    transactions,
    (transaction) => transaction.category
  );
  const topThreeCategories = Object.fromEntries(
    Object.entries(transactionsByCategories)
      .toSorted((a, b) => {
        return (b[1]?.length || 0) - (a[1]?.length || 0);
      })
      .slice(0, 3)
  ) as Record<Category, Transaction[]>;

  const totalCategories = transactions.length

  return (
    <aside className="lg:flex lg:flex-col lg:w-[355px] lg:h-full border-l border-l-slate-400/30">
      <div className="h-32 bg-[url(/images/gradient-mesh.svg)] bg-cover" />

      <div className="p-5">
        <Avatar className="w-24 h-24 -mt-14 mb-4 border-[10px] border-white shadow-md">
          <AvatarImage src="" width={96} height={96} />
          <AvatarFallback>{getUserInitials(username)}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-semibold">{username}</h1>
          <span className="text-slate-700">{email}</span>
        </div>

        <div className="mt-16">
          <div className="flex justify-between">
            <h2 className="font-semibold text-xl">My Banks</h2>

            <Button variant={"ghost"} className="cursor-pointer text-slate-600">
              <Plus />
              Add Bank
            </Button>
          </div>

          <div className="mt-6 relative h-full">
            <div className="z-20 w-11/12 relative">
              <CreditCard
                username={username}
                balance={bankAccounts[0].balance}
                currency={"USD"}
                name={bankAccounts[0].name}
                className="w-full"
              />
            </div>

            <div className="z-10 absolute top-[15%] left-[10%] w-11/12">
              <CreditCard
                username={username}
                balance={bankAccounts[1].balance}
                currency={"USD"}
                name={bankAccounts[1].name}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-15">
            <h2 className="font-semibold text-xl mb-6">Top Categories</h2>

            <div className="space-y-2.5">
              {Object.entries(topThreeCategories).map(([key, val] ,index) => {
                const amount = val.length
                const percentaje = Math.round((amount / totalCategories) * 100)

                return (
                  <CategoryCountBar
                    percentaje={percentaje}
                    key={index}
                    amount={amount}
                    type={key.toLowerCase() as Category} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
