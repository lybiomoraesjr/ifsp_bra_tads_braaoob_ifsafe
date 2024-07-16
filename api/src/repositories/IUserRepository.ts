import { IUser } from "../models/User";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
}

/** Contrato de acesso a dados de usuários. */
export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: CreateUserData): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
}
