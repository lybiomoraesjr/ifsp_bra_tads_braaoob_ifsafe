import { IUser } from "../models/User";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar: string;
  admin: boolean;
}

/** Converte a entidade User do Mongo para o UserDTO esperado pelo app. */
export class UserMapper {
  static toDTO(user: IUser): UserDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? "",
      admin: user.admin,
    };
  }
}
