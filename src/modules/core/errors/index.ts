export abstract class CustomError extends Error{
  constructor(message: string){
    super(message)
  }
}

export type ResponseError = {
  name: string;
  message: string;
  accessToken?: string;
  bankConnectionId?: string;
};

export const toResponseError = (error: CustomError): ResponseError => ({
  name: error.name,
  message: error.message,
  ...("accessToken" in error && typeof error.accessToken === "string"
    ? { accessToken: error.accessToken }
    : {}),
  ...("bankConnectionId" in error && typeof error.bankConnectionId === "string"
    ? { bankConnectionId: error.bankConnectionId }
    : {}),
});

export class DefaultError extends CustomError {
  constructor(message: string){
    super(message)
    this.name = "DefaultError"
  } 
}

export class UnexpectedError extends CustomError {
  constructor(){
    super("An unexpected error occurred")
    this.name = "UnexpectedError"
  }
}

export class PlaidReconnectionError extends CustomError {
  constructor(
    message: string,
    public readonly accessToken: string,
    public readonly bankConnectionId: string
  ) {
    super(message);
    this.name = 'PlaidReconnectionError';
  }
}
