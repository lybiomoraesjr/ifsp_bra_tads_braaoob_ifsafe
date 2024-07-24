import { UnauthorizedError } from "../errors";
import { UserMapper } from "../mappers/UserMapper";
import { IPasswordHasher } from "../providers/IPasswordHasher";
import { ITokenProvider } from "../providers/ITokenProvider";
import { IUserRepository } from "../repositories/IUserRepository";
import { IAuthService, LoginResult } from "./IAuthService";

export class AuthService implements IAuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly hasher: IPasswordHasher,
    private readonly tokens: ITokenProvider
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    }

    const passwordMatches = await this.hasher.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedError("E-mail ou senha incorretos.");
    }

    const token = this.tokens.sign(user._id.toString());
    return { user: UserMapper.toDTO(user), token };
  }
}
