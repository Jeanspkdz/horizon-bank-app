"use server";

import { AppwriteException, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { CustomError, DefaultError } from "@/modules/core/errors";
import { Response } from "@/modules/core/types";
import {
  createAdminClient,
  createSessionClient,
} from "@/modules/core/lib/appwrite";
import { SignInSchema, SignUpSchema } from "@/modules/auth/schemas/index";
import { APPWRITE_COOKIE_NAME } from "@/modules/core/consts";
import { User, UserCreateInput,  } from "@/modules/auth/types";
import {
  UserAlreadyExistsError,
  UserInvalidCredentialsError,
} from "@/modules/auth/errors/index";
import { createDwollaCustomer } from "@/modules/bankConnection/actions/dwolla";
import { VerifiedPersonalCustomer } from "@/modules/bankConnection/types";


const { APPWRITE_DB, APPWRITE_USER_COLLECTION} =
  process.env;

export async function signUp({
  password,
  ...values
}: SignUpSchema): Promise<Response<User>> {
  try {
    const { email, firstName, lastName } = values;

    const { account, database } = await createAdminClient();

    //Use the Appwrite account service to create a new user account
    const newAccountUser = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    //Create Dwolla Customer
    const dwollaCustomer: VerifiedPersonalCustomer = {
      ...values,
      type: "personal",
      address1: values["address"],
    };
    const dwollaCustomerUrl = await createDwollaCustomer(dwollaCustomer);

    // Use the Appwrite database service to store the new user data
    const newUser: UserCreateInput = {
      ...values,
      accountId: newAccountUser.$id,
      dwollaCustomerUrl,
    };

    const documentCreated = await database.createDocument(
      APPWRITE_DB!!!!,
      APPWRITE_USER_COLLECTION!!!!,
      ID.unique(),
      newUser
    );

    const userCreated: User = {
      id: documentCreated.$id,
      ...newUser,
    }

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(APPWRITE_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {
      success: true,
      data: userCreated,
    };
  } catch (err) {
    console.log("[ERR_SIGN_UP_ACTION]", err);

    let customErr: CustomError = new DefaultError("Something went wrong");

    if (err instanceof AppwriteException) {
      if (err.type == "user_already_exists") {
        customErr = new UserAlreadyExistsError("Email already in use");
      }
    }

    return {
      success: false,
      error: customErr,
    };
  }
}

export async function signIn(values: SignInSchema): Promise<Response<null>> {
  try {
    const { email, password } = values;

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(APPWRITE_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.log("[ERR_SIGN_IN_ACTION]", error);

    let customErr: CustomError = new DefaultError("Something went wrong");

    if (error instanceof AppwriteException) {
      if (error.type == "user_invalid_credentials") {
        customErr = new UserInvalidCredentialsError("Invalid credentials");
      }
    }

    return {
      success: false,
      error: customErr,
    };
  }
}

export async function signOut() {
  const { account } = await createSessionClient();

  (await cookies()).delete(APPWRITE_COOKIE_NAME);
  await account.deleteSession("current");
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch (error) {
    return null;
  }
}

