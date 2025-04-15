import { Client } from "dwolla-v2";
import { DWOLLA_ENV, DWOLLA_KEY, DWOLLA_SECRET } from "../consts";



const getEnvironment = (): "production" | "sandbox" => {
  const environment = DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};


export const dwollaClient = new Client({
  environment: getEnvironment(),
  key: DWOLLA_KEY as string,
  secret: DWOLLA_SECRET as string,
});