import { Router } from "express";
import AuthController from "@controllers/authController";

export default function createAuthRoutes(
  authController: AuthController
): Router {
  const router = Router();

  // Public routes
  router.post("/register", authController.register.bind(authController));
  router.post("/login", authController.login.bind(authController));

  return router;
}
