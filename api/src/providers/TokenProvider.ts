import jwt, { SignOptions } from "jsonwebtoken";
import { ITokenProvider } from "./ITokenProvider";

/** Encapsula a emissão e verificação de tokens JWT. */
export class TokenProvider implements ITokenProvider {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string
  ) {}

  sign(userId: string): string {
    const options: SignOptions = {
      subject: userId,
      expiresIn: this.expiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign({}, this.secret, options);
  }

  /** Retorna o id do usuário (subject) ou lança em caso de token inválido. */
  verify(token: string): string {
    const payload = jwt.verify(token, this.secret);
    if (typeof payload === "string" || !payload.sub) {
      throw new Error("Token sem subject.");
    }
    return String(payload.sub);
  }
}
