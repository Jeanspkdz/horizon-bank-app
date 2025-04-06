"use server";

import { AppwriteException, ID, Models } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../lib/appwrite";
import { SignInSchema, SignUpSchema } from "../schemas";
import { cookies } from "next/headers";
import { CustomError, DefaultError } from "@/modules/core/errors";
import { UserAlreadyExistsError, UserInvalidCredentialsError } from "../errors";
import { APPWRITE_COOKIE_NAME } from "../consts";

type Response<T> =
  | { success: true; data: T }
  | { success: false; error: CustomError };

export async function signUp(
  values: SignUpSchema
): Promise<Response<Models.User<Models.Preferences>>> {
  try {
    const { email, password, firstName, lastName } = values;

    const { account } = await createAdminClient();

    const newUser = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
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

    let customErr: CustomError = new DefaultError("Something went wrong");;

    if (err instanceof AppwriteException) {
      if (err.type == "user_already_exists"){
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
): Promise<Response<Models.Session>> {
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
      data: session,
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
