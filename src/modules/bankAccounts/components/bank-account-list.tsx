import { CreditCard } from "@/modules/core/components/credit-card";
import { getBankAccountsByUser } from "../actions";

interface UserBankAcccountListProps {
  userId: string;
  username: string;
}
export const UserBankAccountsList = async ({
  userId,
  username,
}: UserBankAcccountListProps) => {
  const bankAccounts = await getBankAccountsByUser({
    userId,
  });

  return (
    <>
      {bankAccounts.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {bankAccounts.map((account) => (
            <CreditCard
              key={account.id}
              username={username}
              name={account.name}
              balance={account.balance ?? "No balance available"}
              currency={"USD"}
              shareableId={account.shareableId}
            />
          ))}
        </div>
      ) : (
        <div className="">
          <p className="max-w-[60ch] mt-4 italic text-gray-600">
            It seems you don't have any bank accounts connected. If this is an
            problem, please contact support
          </p>
        </div>
      )}
    </>
  );
};
