import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors";

/**
 * Tratamento central de erros. Responde SEMPRE com uma string no corpo, pois o
 * app mobile lê `response.data` diretamente como a mensagem de erro.
 *
 * Trata qualquer subclasse de `AppError` de forma polimórfica (lê `statusCode`).
 */
export class ErrorHandler {
  handle = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json(err.message);
      return;
    }

    if (err instanceof ZodError) {
      const message = err.errors[0]?.message ?? "Dados inválidos.";
      res.status(400).json(message);
      return;
    }

    console.error("Erro não tratado:", err);
    res.status(500).json("Erro interno no servidor.");
  };
}
