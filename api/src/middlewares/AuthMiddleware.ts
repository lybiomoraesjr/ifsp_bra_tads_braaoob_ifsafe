import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { ITokenProvider } from "../providers/ITokenProvider";
import { IUserRepository } from "../repositories/IUserRepository";

export class AuthMiddleware {
  constructor(
    private readonly tokens: ITokenProvider,
    private readonly users: IUserRepository
  ) {}

  /**
   * Lê o token SEMPRE do header HTTP `Authorization: Bearer <token>`.
   * O `headers` que o app às vezes envia no corpo é ignorado.
   */
  ensureAuth = (req: Request, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header) {
      throw new UnauthorizedError("Token de autenticação não informado.");
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedError("Token de autenticação malformado.");
    }

    try {
      req.userId = this.tokens.verify(token);
    } catch {
      throw new UnauthorizedError("Token de autenticação inválido ou expirado.");
    }

    next();
  };

  /** Exige que o usuário autenticado seja administrador. Use após `ensureAuth`. */
  ensureAdmin = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = await this.users.findById(req.userId!);
    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado.");
    }
    if (!user.admin) {
      throw new ForbiddenError("Ação restrita a administradores.");
    }

    req.userAdmin = true;
    next();
  };
}
