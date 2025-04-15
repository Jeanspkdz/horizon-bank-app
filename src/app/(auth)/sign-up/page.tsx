"use client";

import { useEffect, useState } from "react";
import { createLinkToken } from "@/modules/bankConnection/actions/plaid";
import { ConnectBankPanel } from "@/modules/auth/components/connect-bank-pannel";
import { FormSignUp } from "@/modules/auth/components/form-sign-up";
import { User } from "@/modules/auth/types";

function SignUpPage() {
  const [user, setUser] = useState<null | User>(null);
  const [linkToken, setLinkToken] = useState<string>("");

  const updateUser = (user: User) => {
    setUser(user);
  };

  useEffect(() => {
    if(!user) return
    console.log("USER", user);
    

    const getLinkToken = async () => {
      const response = await createLinkToken(user);
      if (response.success) {
        setLinkToken(response.data);
      }
    };

    getLinkToken();
  }, [user]);

  return (
    <section className="max-w-10/12 min-w-7/12 lg:max-w-[420px] py-16">
      {user == null ? (
        <FormSignUp updateUser={updateUser} />
      ) : (
        <ConnectBankPanel user={user} linkToken={linkToken} />
      )}
    </section>
  );
}

export default SignUpPage;
