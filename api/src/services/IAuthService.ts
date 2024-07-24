import { UserDTO } from "../mappers/UserMapper";

export interface LoginResult {
  user: UserDTO;
  token: string;
}

/** Contrato do serviço de autenticação. */
export interface IAuthService {
  login(email: string, password: string): Promise<LoginResult>;
}
