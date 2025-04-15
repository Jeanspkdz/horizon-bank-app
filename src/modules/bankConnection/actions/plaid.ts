"use server";

import {
  CountryCode,
  Products,
  LinkTokenCreateRequest,
  ItemPublicTokenExchangeRequest,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
} from "plaid";
import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import { BankConnection, BankConnectionCreateInput, LinkToken } from "@/modules/bankConnection/types";
import { linkBankAccountWithDwolla } from "@/modules/bankConnection/actions/dwolla";
import { Response } from "@/modules/core/types";
import { DefaultError } from "@/modules/core/errors";
import { createBankAccount } from "@/modules/bankConnection/actions/bank";
import { User } from "@/modules/auth/types";

export async function createLinkToken(
  user: User
): Promise<Response<LinkToken>> {
  const request = {
    client_name: `${user.firstName} ${user.lastName}`,
    language: "en",
    country_codes: ["US"] as CountryCode[],
    user: {
      client_user_id: user.accountId,
    },
    products: ["auth"] as Products[],
  } satisfies LinkTokenCreateRequest;

  try {
    const response = await plaidClient.linkTokenCreate(request);
    const linkToken = response.data.link_token;

    return {
      success: true,
      data: linkToken,
    };
  } catch (error) {
    console.log("[ERR_CREATE_LINK_TOKEN]", error);

    return {
      success: false,
      error: new DefaultError("Something went wrong"),
    };
  }
}

interface ExchangePublicTokenRequest {
  publicToken: string;
}
export async function exchangePublicToken({
  publicToken,
}: ExchangePublicTokenRequest) {
  const request: ItemPublicTokenExchangeRequest = {
    public_token: publicToken,
  };
  try {
    const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange(
      request
    );
    const accessToken = exchangeTokenResponse.data.access_token;
    const itemId = exchangeTokenResponse.data.item_id;

    return {
      accessToken,
      itemId,
    };
  } catch (error) {
    console.log("[ERR_EXCHANGE_PUBLIC_TOKEN]", error);
    throw new DefaultError("Something went wrong");
  }
}

interface CreateProcessorTokenRequest {
  accessToken: string;
  accountId: string;
}
export async function createProcessorToken({
  accessToken,
  accountId,
}: CreateProcessorTokenRequest) {
  try {
    // Create proccessor token
    const processorTokenRequest: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountId,
      processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      processorTokenRequest
    );
    const processorToken = processorTokenResponse.data.processor_token;

    return processorToken;
  } catch (error) {
    console.log("[ERR_CREATE_PROCESSOR_TOKEN]", error);
    throw new DefaultError("Something went wrong");
  }
}

export async function getBankAccountInfo(accessToken: string) {
  try {
    const userAccountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const account = userAccountResponse.data.accounts[0];

    return account;
  } catch (error) {
    console.log("[ERR_GET_BANK_ACCOUNT_INFO]", error);
    throw new DefaultError("Something went wrong");
  }
}

interface SetUpBankAccountIntegrationRequest {
  publicToken: string;
  user: User;
}
export async function setUpBankAccountIntegration({
  publicToken,
  user,
}: SetUpBankAccountIntegrationRequest): Promise<Response<null>> {
  try {
    const { accessToken, itemId } = await exchangePublicToken({ publicToken });

    // Just one account since Single Account is enabled in plaid dashboard
    const account = await getBankAccountInfo(accessToken);

    //Create processor token
    const processorToken = await createProcessorToken({
      accessToken,
      accountId: account.account_id,
    });

    const fundingSourceUrl = await linkBankAccountWithDwolla({
      customerId: user.dwollaCustomerUrl.split("/").pop() as string,
      processorToken,
      bankName: account.name,
    });

    // Store Bank Account in Appwrite DB
    const bank: BankConnectionCreateInput = {
      userId: user.id,
      accessToken, // Plaid
      itemId: itemId,// Plaid
      fundingSourceUrl: fundingSourceUrl, // Dwolla
    };
    await createBankAccount(bank);

    console.log("BANK CREATED");

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.log("[ERR_SETTING_UP_ACCOUNT]", error);

    return {
      success: false,
      error: new DefaultError("Something went wrong"),
    };
  }
}
