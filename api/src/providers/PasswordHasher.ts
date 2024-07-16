import bcrypt from "bcryptjs";
import { IPasswordHasher } from "./IPasswordHasher";

/** Encapsula o algoritmo de hash de senhas (bcrypt). */
export class PasswordHasher implements IPasswordHasher {
  constructor(private readonly rounds: number = 10) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
