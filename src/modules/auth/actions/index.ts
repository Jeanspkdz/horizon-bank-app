"use server";

import { AppwriteException, ID, Models } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../lib/appwrite";
import { SignInSchema, SignUpSchema } from "../schemas";
import { cookies } from "next/headers";
import { CustomError, DefaultError } from "@/modules/core/errors";
import { UserAlreadyExistsError, UserInvalidCredentialsError } from "../errors";
import { APPWRITE_COOKIE_NAME } from "../consts";
import { User } from "../types";
import { Response } from "@/modules/core/types";

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

    // Use the Appwrite database service to store the new user data
    const newUser: User = {
      ...values,
      userId: newAccountUser.$id,
    };

    await database.createDocument(
      process.env.NEXT_APPWRITE_DB!!!!,
      process.env.NEXT_APPWRITE_USER_COLLECTION!!!!,
      ID.unique(),
      newUser
    );

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(APPWRITE_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true, 
      sameSite: "strict",
      secure: true,
    });

    return {
      success: true,
      data: newUser,
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

export async function signIn(
  values: SignInSchema
): Promise<Response<null>> {
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
