"use server";

import { User } from "@/modules/auth/types";
import {
  createBankAccount,
  getBankAccountsFromPlaid,
} from "@/modules/bankAccounts/actions";
import { createBankConnection } from "@/modules/bankConnection/actions/bank-connection";
import { generateFundingSource } from "@/modules/bankConnection/actions/dwolla";
import { plaidClient } from "@/modules/bankConnection/lib/plaid";
import {
  BankConnectionCreateInput,
  LinkToken
} from "@/modules/bankConnection/types";
import { DefaultError } from "@/modules/core/errors";
import { Response } from "@/modules/core/types";
import {
  CountryCode,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

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
    products: [Products.Auth, Products.Transactions] as Products[],
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

    // Store Bank Account in Appwrite DB
    const bank: BankConnectionCreateInput = {
      userId: user.id,
      accessToken, // Plaid
      itemId: itemId, // Plaid
    };
    const bankConnectionCreated = await createBankConnection(bank);
    console.log("BANK CONNECTION CREATED");

    const accounts = await getBankAccountsFromPlaid(accessToken);

    for (const account of accounts) {
      //Create processor token
      const processorToken = await createProcessorToken({
        accessToken,
        accountId: account.account_id,
      });

      // Represents a bank account linked to a customer, used as a source or destination for transactions.
      const fundingSourceUrl = await generateFundingSource({
        customerId: user.dwollaCustomerUrl.split("/").pop() as string,
        processorToken,
        bankName: account.name,
      });

      //Store in Appwrite DB
      await createBankAccount({
        name: account.name,
        officialName: account.official_name ?? account.name,
        type: account.type,
        subtype: account.subtype ?? "unknown",
        fundingSourceUrl,
        externalAccountId: account.account_id,
        balance: account.balances.available ?? account.balances.current ?? 0,
        bankConnectionId: bankConnectionCreated.id,
      });
    }

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
