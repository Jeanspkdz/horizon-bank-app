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