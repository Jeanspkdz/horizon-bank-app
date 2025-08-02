
import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { getBankAccounts } from "@/modules/bankAccounts/actions";
import { TransactionPanel } from "@/modules/transactions/components/transaction-panel";
import { TransactionPanelSkeleton } from "@/modules/transactions/components/transaction-panel-skeleton";
import { Suspense } from "react";

async function TransactionHistoryPage() {
  const user = await getLoggedInUser();
  if (!user.success) {
    throw user.error;
  }

  const bankAccountsPromise =  getBankAccounts(user.data.id);
  
  return (
   <Suspense fallback={<TransactionPanelSkeleton/>}>
      <TransactionPanel  
        bankAccountsPromise={bankAccountsPromise}
      />
   </Suspense>
  );
}

export default TransactionHistoryPage;
