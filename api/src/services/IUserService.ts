import { UserDTO } from "../mappers/UserMapper";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  oldpassword?: string;
  newpassword?: string;
  avatar?: string;
}

/** Contrato do serviço de usuários. */
export interface IUserService {
  create(input: CreateUserInput): Promise<UserDTO>;
  update(id: string, requesterId: string, input: UpdateUserInput): Promise<UserDTO>;
}
