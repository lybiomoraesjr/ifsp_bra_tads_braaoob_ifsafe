import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors";
import { UserMapper, UserDTO } from "../mappers/UserMapper";
import { IPasswordHasher } from "../providers/IPasswordHasher";
import { IUserRepository } from "../repositories/IUserRepository";
import {
  CreateUserInput,
  IUserService,
  UpdateUserInput,
} from "./IUserService";

export class UserService implements IUserService {
  constructor(
    private readonly users: IUserRepository,
    private readonly hasher: IPasswordHasher
  ) {}

  async create(input: CreateUserInput): Promise<UserDTO> {
    const exists = await this.users.findByEmail(input.email);
    if (exists) {
      throw new ConflictError("E-mail já cadastrado.");
    }

    const hashed = await this.hasher.hash(input.password);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      password: hashed,
      admin: false,
    });

    return UserMapper.toDTO(user);
  }

  /** Atualiza o próprio perfil. `requesterId` vem do token (ensureAuth). */
  async update(
    id: string,
    requesterId: string,
    input: UpdateUserInput
  ): Promise<UserDTO> {
    if (id !== requesterId) {
      throw new ForbiddenError(
        "Você não tem permissão para editar este usuário."
      );
    }

    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    if (input.name) {
      user.name = input.name;
    }

    if (input.avatar) {
      user.avatar = input.avatar;
    }

    // Só altera a senha quando uma nova senha não-vazia foi enviada.
    if (input.newpassword) {
      if (input.newpassword.length < 6) {
        throw new BadRequestError("A nova senha deve ter pelo menos 6 dígitos.");
      }
      if (!input.oldpassword) {
        throw new BadRequestError("Informe a senha atual para alterá-la.");
      }
      const matches = await this.hasher.compare(
        input.oldpassword,
        user.password
      );
      if (!matches) {
        throw new BadRequestError("Senha atual incorreta.");
      }
      user.password = await this.hasher.hash(input.newpassword);
    }

    await this.users.save(user);
    return UserMapper.toDTO(user);
  }
}
