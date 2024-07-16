import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;

  constructor(message = "Não autorizado.") {
    super(message);
  }
}
