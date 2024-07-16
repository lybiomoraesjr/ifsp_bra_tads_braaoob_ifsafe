import { AppError } from "./AppError";

export class ConflictError extends AppError {
  public readonly statusCode = 409;

  constructor(message = "Conflito de dados.") {
    super(message);
  }
}
