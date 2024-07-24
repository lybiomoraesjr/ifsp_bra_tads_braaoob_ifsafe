import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Encapsula handlers assíncronos para que rejeições de Promise sejam
 * encaminhadas ao error handler do Express (que no Express 4 não captura
 * erros assíncronos automaticamente).
 */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
