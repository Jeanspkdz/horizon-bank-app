import { Models } from "node-appwrite"
import { User } from "@/modules/auth/types"
import { BankConnection, BankConnectionIncludeOptions, BankConnectionWithInclude } from "../types";
import { z } from "zod";
import { DefaultError } from "@/modules/core/errors";

export function mapToBankConnection<IOptions extends BankConnectionIncludeOptions>(
  document: Models.DefaultRow & Record<string, unknown>,
  include?: IOptions
) : BankConnectionWithInclude<IOptions>{

  let schema = BankConnection;

  let normalizedDocument: Record<string, unknown> = {
    ...document,
    id: document.$id,
  };

  if (include?.user) {
    schema = schema.extend({
      userId: z.string(),
      user: User,
    });

    const userId = (normalizedDocument.userId as Record<string, unknown>).$id 
    const user = normalizedDocument.userId as Record<string, unknown>
    user["id"] = user.$id


    normalizedDocument = {
      ...normalizedDocument,
      user,
      userId: userId,
    };
  }

  const parsed = schema.safeParse(normalizedDocument);
  console.log("MAP PARSED", parsed);

  if (!parsed.success) {
    throw new DefaultError("Failed to parse BankAccount");
  }

  return parsed.data as unknown as BankConnectionWithInclude<IOptions> ;
}
