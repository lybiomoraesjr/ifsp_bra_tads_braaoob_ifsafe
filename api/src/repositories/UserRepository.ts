import { IUser, User } from "../models/User";
import { CreateUserData, IUserRepository } from "./IUserRepository";

/** Abstrai o acesso à coleção de usuários no MongoDB. */
export class UserRepository implements IUserRepository {
  findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  create(data: CreateUserData): Promise<IUser> {
    return User.create(data);
  }

  save(user: IUser): Promise<IUser> {
    return user.save();
  }
}
