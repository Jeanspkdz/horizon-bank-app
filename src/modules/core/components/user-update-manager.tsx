import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { PlaidReconnectionError } from "../errors";

import { createLinkTokenForUpdateMode } from "@/modules/bankConnection/actions/plaid";
import { syncUserBankData } from "../actions";
import { ReauthenticateModal } from "./reauthenticate-modal";

export const UserUpdateManager = async () => {
  const authResponse = await getLoggedInUser();
  if (!authResponse.success) {
    throw authResponse.error;
  }
  const user = authResponse.data;

  const response = await syncUserBankData(user.id)

  if (response.success) {
    return null;
  }

  const error = response.error

  if(typeof error !== 'object' || !(error instanceof PlaidReconnectionError)){
    throw error
  }

  const linkTokenResponse = await createLinkTokenForUpdateMode(user, error.accessToken) 

  if(!linkTokenResponse.success){
    throw linkTokenResponse.error
  }

  return (
   <ReauthenticateModal linkToken={linkTokenResponse.data}/>
  );
};
