import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  public readonly statusCode = 400;

  constructor(message = "Requisição inválida.") {
    super(message);
  }
}
