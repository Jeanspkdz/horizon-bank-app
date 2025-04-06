import { CustomError } from "@/modules/core/errors";

export class UserAlreadyExistsError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}

export class UserInvalidCredentialsError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "UserInvalidCredentialsError";
  }
}