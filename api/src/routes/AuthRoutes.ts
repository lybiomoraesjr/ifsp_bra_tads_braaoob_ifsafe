import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthRoutes {
  public readonly router = Router();

  constructor(controller: AuthController) {
    this.router.post("/", asyncHandler(controller.login));
  }
}
