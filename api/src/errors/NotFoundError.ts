import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  public readonly statusCode = 404;

  constructor(message = "Recurso não encontrado.") {
    super(message);
  }
}
