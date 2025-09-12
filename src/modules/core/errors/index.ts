export abstract class CustomError extends Error{
  constructor(message: string){
    super(message)
  }
}

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