import { Router } from "express";
import { OccurrenceController } from "../controllers/OccurrenceController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

export class OccurrenceRoutes {
  public readonly router = Router();

  constructor(controller: OccurrenceController, auth: AuthMiddleware) {
    const ensureAuth = asyncHandler(auth.ensureAuth);

    this.router.get("/", ensureAuth, asyncHandler(controller.list));
    this.router.get("/:id", ensureAuth, asyncHandler(controller.show));
    this.router.post("/", ensureAuth, asyncHandler(controller.create));
    this.router.post("/likes/:id", ensureAuth, asyncHandler(controller.like));
    this.router.post(
      "/comments/:id",
      ensureAuth,
      asyncHandler(controller.comment)
    );
    this.router.put(
      "/status/:id",
      ensureAuth,
      asyncHandler(auth.ensureAdmin),
      asyncHandler(controller.changeStatus)
    );
  }
}
