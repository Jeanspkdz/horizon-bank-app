import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { UserBankAccountsList } from "@/modules/bankAccounts/components/bank-account-list";
import { UserBankAccountListSkeleton } from "@/modules/bankAccounts/components/bank-account-list-skeleton";
import { Heading } from "@/modules/core/components/heading";
import { Suspense } from "react";

async function MyBanksPage() {
  const userResponse = await getLoggedInUser();

  if (!userResponse.success) {
    throw userResponse.error;
  }

  const user = userResponse.data;

  return (
    <div className="p-5">
      <Heading
        type="default"
        title="My Bank Accounts"
        subtitle="Effortlessly manage your Banking Actvities"
      />

      <div className="mt-10 h-full @container">
        <h2 className="font-bold">Your Cards</h2>

        <div className="mt-6">
          <Suspense fallback={<UserBankAccountListSkeleton />}>
            <UserBankAccountsList
              userId={user.id}
              username={`${user?.firstName} ${user?.lastName}`}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default MyBanksPage;
