"use server";

import { VerifiedPersonalCustomer } from "@/modules/bankConnection/types";
import { DefaultError } from "@/modules/core/errors";
import { equalsIgnoreCase } from "@/modules/bankConnection/lib/util"
import { dwollaClient } from "../lib/dwolla";



export const createDwollaCustomer = async (
  newCustomer: VerifiedPersonalCustomer
) => {
  try {
    const response = await dwollaClient.post("customers", newCustomer);
    const resourceCreatedLocation = response.headers.get("location") as string;

    return resourceCreatedLocation;
  } catch (err) {
    console.log("[ERR_CREATE_DWOLLA_CUSTOMER]", err);
    throw new DefaultError("Creating a Dwolla customer failed");
  }
};

// Retrieve the exchange partner link for Plaid
async function getExchangeHref(): Promise<string> {
  const response = await dwollaClient.get("exchange-partners");
  const partnersList = response.body._embedded["exchange-partners"];
  const plaidPartner = partnersList.filter((obj: { name: string }) =>
    equalsIgnoreCase(obj.name, "PLAID")
  )[0];
  return plaidPartner._links.self.href;
}

// Create an exchange using the exchange partner link and the processor token
interface CreateExchangeOptions {
  customerId: string;
  exchangePartnerHref: string;
  processorToken: string;
}
const createExchange = async (options: CreateExchangeOptions) => {
  console.log("CREATE_EXCHANGE", options);

  const response = await dwollaClient.post(
    `customers/${options.customerId}/exchanges`,
    {
      _links: {
        "exchange-partner": {
          href: options.exchangePartnerHref,
        },
      },
      token: options.processorToken,
    }
  );

  const location = response.headers.get("location");

  if (!location) {
    throw new Error("Exchange location header is missing.");
  }

  return location;
};

// Create a funding source using the exchange
interface CreateFundingSourceOptions {
  customerId: string;
  exchangeUrl: string;
  fundingSourceName: string;
  type: "checking" | "savings";
}
const createFundingSource = async (options: CreateFundingSourceOptions) => {
  const response = await dwollaClient.post(
    `customers/${options.customerId}/funding-sources`,
    {
      _links: {
        exchange: {
          href: options.exchangeUrl,
        },
      },
      bankAccountType: options.type, // "checking" or "savings"
      name: options.fundingSourceName,
    }
  );

  const location = response.headers.get("location");

  if (!location) {
    throw new Error("Funding source location header is missing.");
  }

  return location;
};

interface LinkBankAccountWithDwollaOptions {
  processorToken: string;
  customerId: string;
  bankName: string;
}
export async function generateFundingSource({
  processorToken,
  customerId,
  bankName,
}: LinkBankAccountWithDwollaOptions) {
  const exchangePartnerHref = await getExchangeHref();
  const exchangeUrl = await createExchange({
    exchangePartnerHref,
    processorToken,
    customerId,
  });

  const fundingSourceUrl = await createFundingSource({
    customerId,
    exchangeUrl,
    fundingSourceName: bankName,
    type: "checking",
  });

  return fundingSourceUrl;
}
