import { env } from "../config/env";

import { IUserRepository } from "../repositories/IUserRepository";
import { IOccurrenceRepository } from "../repositories/IOccurrenceRepository";
import { UserRepository } from "../repositories/UserRepository";
import { OccurrenceRepository } from "../repositories/OccurrenceRepository";

import { IPasswordHasher } from "../providers/IPasswordHasher";
import { ITokenProvider } from "../providers/ITokenProvider";
import { PasswordHasher } from "../providers/PasswordHasher";
import { TokenProvider } from "../providers/TokenProvider";

import { IAuthService } from "../services/IAuthService";
import { IUserService } from "../services/IUserService";
import { IOccurrenceService } from "../services/IOccurrenceService";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { OccurrenceService } from "../services/OccurrenceService";

import { AuthController } from "../controllers/AuthController";
import { UserController } from "../controllers/UserController";
import { OccurrenceController } from "../controllers/OccurrenceController";

import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ErrorHandler } from "../middlewares/ErrorHandler";

import { AuthRoutes } from "../routes/AuthRoutes";
import { UserRoutes } from "../routes/UserRoutes";
import { OccurrenceRoutes } from "../routes/OccurrenceRoutes";

/**
 * Composition Root: ponto único onde as dependências são instanciadas e
 * injetadas (injeção de dependências manual). As camadas só conhecem
 * abstrações recebidas pelo construtor, nunca constroem suas próprias
 * dependências.
 */
export class Container {
  public readonly authRoutes: AuthRoutes;
  public readonly userRoutes: UserRoutes;
  public readonly occurrenceRoutes: OccurrenceRoutes;
  public readonly errorHandler: ErrorHandler;

  constructor() {
    // Infraestrutura — único ponto que amarra cada abstração à implementação.
    const userRepository: IUserRepository = new UserRepository();
    const occurrenceRepository: IOccurrenceRepository =
      new OccurrenceRepository();
    const hasher: IPasswordHasher = new PasswordHasher();
    const tokens: ITokenProvider = new TokenProvider(
      env.jwtSecret,
      env.jwtExpiresIn
    );

    // Regra de negócio (dependem apenas das interfaces acima)
    const authService: IAuthService = new AuthService(
      userRepository,
      hasher,
      tokens
    );
    const userService: IUserService = new UserService(userRepository, hasher);
    const occurrenceService: IOccurrenceService = new OccurrenceService(
      occurrenceRepository
    );

    // Apresentação (HTTP)
    const authMiddleware = new AuthMiddleware(tokens, userRepository);

    this.authRoutes = new AuthRoutes(new AuthController(authService));
    this.userRoutes = new UserRoutes(
      new UserController(userService),
      authMiddleware
    );
    this.occurrenceRoutes = new OccurrenceRoutes(
      new OccurrenceController(occurrenceService),
      authMiddleware
    );
    this.errorHandler = new ErrorHandler();
  }
}
