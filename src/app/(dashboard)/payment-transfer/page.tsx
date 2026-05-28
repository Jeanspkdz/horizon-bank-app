import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { getBankAccountsByUser } from "@/modules/bankAccounts/actions";
import { Heading } from "@/modules/core/components/heading";
import { TransferPanel } from "@/modules/transfers/components/transfer-panel";
import { redirect } from "next/navigation";

async function PaymentTransferPage() {
  const response = await getLoggedInUser();
  if (!response.success) {
    redirect("/sign-in");
  }

  const user = response.data;

  const bankAccountsPromise = getBankAccountsByUser({ userId: user.id });

  return (
    <div className="p-5 max-w-5xl">
      <Heading
        type="default"
        title="Payment Transfer"
        subtitle="Please provide any specific details or notes related to the payment transfer"
      />

      <TransferPanel bankAccountsPromise={bankAccountsPromise} />
    </div>
  );
}

export default PaymentTransferPage;
