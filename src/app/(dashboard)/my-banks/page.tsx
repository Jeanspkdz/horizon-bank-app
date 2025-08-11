import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { getBankAccountsByUser } from "@/modules/bankAccounts/actions";
import { CreditCard } from "@/modules/core/components/credit-card";
import { Heading } from "@/modules/core/components/heading";

async function MyBanksPage() {
  const userResponse = await getLoggedInUser();

  if (!userResponse.success) {
    throw userResponse.error;
  }

  const user = userResponse.data
  const bankAccounts = await getBankAccountsByUser({
    userId: user.id
  });
  console.log(bankAccounts);

  return (
    <div className="p-5">
      <Heading
        type="default"
        title="My Bank Accounts"
        subtitle="Effortlessly manage your Banking Actvities"
      />

      <div className="mt-10 h-full @container">
        <h2 className="font-bold">Your Cards</h2>

        {bankAccounts.length > 0 ? (
          <div className="flex flex-wrap gap-4 mt-6">
            {bankAccounts.map((account) => (
              <CreditCard
                key={account.id}
                username={`${user?.firstName} ${user?.lastName}`}
                name={account.name}
                balance={account.balance ?? "No balance available" }
                currency={"USD"}
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
      </div>
    </div>
  );
}

export default MyBanksPage;
