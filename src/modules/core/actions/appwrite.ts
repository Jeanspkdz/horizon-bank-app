"use server"
import { APPWRITE_COOKIE_NAME } from "@/modules/core/consts";
import { cookies } from "next/headers";
import { Account, Client, Databases, TablesDB } from "node-appwrite";


export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!!!!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!!!!);

  const cookiesStore = await cookies();
  const session = cookiesStore.get(APPWRITE_COOKIE_NAME);
  if (!session || !session.value) {
    console.log("[ERR_SESSION]", "No session found in cookies");
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!!!!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!!!!)
    .setKey(process.env.NEXT_APPWRITE_KEY!!!!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get tableDB() {
      return new TablesDB(client)
    }
  };
}