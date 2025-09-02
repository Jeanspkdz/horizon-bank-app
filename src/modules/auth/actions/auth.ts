"use server";

import {
  UserAlreadyExistsError,
  UserInvalidCredentialsError,
} from "@/modules/auth/errors/index";
import { SignInSchema, SignUpSchema } from "@/modules/auth/schemas/index";
import { User, UserCreateInput } from "@/modules/auth/types";
import { createDwollaCustomer } from "@/modules/bankConnection/actions/dwolla";
import { VerifiedPersonalCustomer } from "@/modules/bankConnection/types";
import { createAdminClient , createSessionClient} from "@/modules/core/actions/appwrite";
import { APPWRITE_COOKIE_NAME } from "@/modules/core/consts";
import { CustomError, DefaultError, UnexpectedError } from "@/modules/core/errors";
import { Response } from "@/modules/core/types";
import { cookies } from "next/headers";
import { AppwriteException, ID, Query } from "node-appwrite";

const { APPWRITE_DB, APPWRITE_USER_COLLECTION } = process.env;

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

    // Use Appwrite database service to store the new user data
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
    };

    // Once the user is created, set a new session
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

export async function signOut() : Promise<void> {
  const { account } = await createSessionClient();

  (await cookies()).delete(APPWRITE_COOKIE_NAME);
  await account.deleteSession("current");
}

export async function getLoggedInUser() : Promise<Response<User>> {
  try {
    const { account } = await createSessionClient();
    const { database } = await createAdminClient();
    const userAccount = await account.get();

    const documentResponse = await database.listDocuments(
      APPWRITE_DB!!,
      APPWRITE_USER_COLLECTION!!,
      [Query.equal("accountId", userAccount.$id)]
    );

    const userDocument = documentResponse.documents[0];

    const user: User = {
      id: userDocument.$id,
      firstName: userDocument["firstName"],
      lastName: userDocument["lastName"],
      email: userDocument["email"],
      address: userDocument["address"],
      city: userDocument["city"],
      dateOfBirth: userDocument["dateOfBirth"],
      postalCode: userDocument["postalCode"],
      ssn: userDocument["ssn"],
      state: userDocument["state"],
      dwollaCustomerUrl: userDocument["dwollaCustomerUrl"],
      accountId: userDocument["accountId"],
    };

    return  {
      success: true,
      data: user
    }

  } catch (error) {
    //Handle Expected Exceptions

    return {
      success: false,
      error: new UnexpectedError()
    }
  }
}
