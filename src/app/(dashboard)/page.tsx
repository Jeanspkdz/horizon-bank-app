import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { updateBankAccountBalanceByUser } from "@/modules/bankAccounts/actions";
import { HomePanel } from "@/modules/core/components/home-panel";
import { HomePanelSkeleton } from "@/modules/core/components/home-panel-skeleton";
import { Suspense } from "react";

const HomePage = async () => {
  return (
    <Suspense fallback={<HomePanelSkeleton />}>
      <HomePanel />
    </Suspense>
  );
};

export default HomePage;
