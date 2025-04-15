import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Logo } from "@/modules/core/components/logo";
import { Button } from "@/modules/core/components/ui/button";
import { setUpBankAccountIntegration } from "@/modules/bankConnection/actions/plaid";
import { FormHeader } from "./form-header";
import { User } from "../types";

interface ConnectBankPanel {
  user: User;
  linkToken: string;
}

export const ConnectBankPanel = ({ user, linkToken }: ConnectBankPanel) => {
  const config: PlaidLinkOptions = {
    onSuccess: async (public_token, metadata) => {
      // SetUp BankAccount
      const response = await setUpBankAccountIntegration({
        publicToken: public_token,
        user,
      });

      if (response.success) {
        return redirect("/");
      }

      toast.error("Something went wrong");
    },
    token: linkToken,
  };
  const { ready, open } = usePlaidLink(config);

  return (
    <section className="w-9/12 max-w-[420px]">
      <div className="flex flex-col gap-6">
        <Logo />
        <FormHeader
          title={"Link Account"}
          message={"Link your account to get started"}
        />
        <Button variant={"primary"} disabled={!ready} onClick={() => open()}>
          Connect Bank
        </Button>
      </div>
    </section>
  );
};
