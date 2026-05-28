import { getLoggedInUser } from "@/modules/auth/actions/auth";
import { createLinkTokenForUpdateMode } from "@/modules/bankConnection/actions/plaid";
import { syncUserBankData } from "../actions";
import { ReauthenticateModal } from "./reauthenticate-modal";

export const UserUpdateManager = async () => {
  const authResponse = await getLoggedInUser();
  if (!authResponse.success) {
    return null;
  }
  const user = authResponse.data;

  const response = await syncUserBankData(user.id)

  if (response.success) {
    return null;
  }

  const error = response.error

  if(error.name !== "PlaidReconnectionError" || !error.accessToken){
    throw new Error(error.message)
  }

  const linkTokenResponse = await createLinkTokenForUpdateMode(user, error.accessToken) 

  if(!linkTokenResponse.success){
    throw new Error(linkTokenResponse.error.message)
  }

  return (
   <ReauthenticateModal linkToken={linkTokenResponse.data}/>
  );
};
