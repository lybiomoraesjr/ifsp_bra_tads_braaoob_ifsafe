import { Request, Response } from "express";
import { z } from "zod";
import { IAuthService } from "../services/IAuthService";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  // POST /auth
  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await this.authService.login(email, password);
    res.json(result);
  };
}
