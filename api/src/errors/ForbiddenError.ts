import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;

  constructor(message = "Acesso negado.") {
    super(message);
  }
}
