import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

export class UserRoutes {
  public readonly router = Router();

  constructor(controller: UserController, auth: AuthMiddleware) {
    this.router.post("/", asyncHandler(controller.create));
    this.router.put(
      "/:id",
      asyncHandler(auth.ensureAuth),
      asyncHandler(controller.update)
    );
  }
}
