import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { getBankAccounts } from "@/modules/bankAccounts/actions";
import { CreditCard } from "@/modules/core/components/credit-card";
import { Heading } from "@/modules/core/components/heading";

async function MyBanksPage() {
  const userResponse = await getLoggedInUser();

  if (!userResponse.success) {
    throw userResponse.error;
  }

  const user = userResponse.data
  const bankAccountsResponse = await getBankAccounts(user.id);

  if (!bankAccountsResponse.success) {
    throw bankAccountsResponse.error
  }

  return (
    <div className="p-5">
      <Heading
        type="default"
        title="My Bank Accounts"
        subtitle="Effortlessly manage your Banking Actvities"
      />

      <div className="mt-10 h-full @container">
        <h2 className="font-bold">Your Cards</h2>

        {bankAccountsResponse.data.length > 0 ? (
          <div className="flex flex-wrap gap-4 mt-6">
            {bankAccountsResponse.data.map((account) => (
              <CreditCard
                key={account.account_id}
                username={`${user?.firstName} ${user?.lastName}`}
                name={account.name}
                balance={account.balances.available ?? "No balance available" }
                currency={account.balances.iso_currency_code ?? "USD"}
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
