import { Request, Response } from "express";
import { z } from "zod";
import { IUserService } from "../services/IUserService";

const createSchema = z.object({
  name: z.string().min(1, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 dígitos."),
});

// Campos opcionais; o app às vezes envia strings vazias e um `headers` espúrio
// (descartado por padrão pelo Zod).
const updateSchema = z.object({
  name: z.string().min(1).optional(),
  oldpassword: z.string().optional(),
  newpassword: z.string().optional(),
  avatar: z.string().optional(),
});

export class UserController {
  constructor(private readonly userService: IUserService) {}

  // POST /users
  create = async (req: Request, res: Response): Promise<void> => {
    const data = createSchema.parse(req.body);
    const user = await this.userService.create(data);
    res.status(201).json(user);
  };

  // PUT /users/:id
  update = async (req: Request, res: Response): Promise<void> => {
    const data = updateSchema.parse(req.body);
    const user = await this.userService.update(req.params.id, req.userId!, data);
    res.json(user);
  };
}
