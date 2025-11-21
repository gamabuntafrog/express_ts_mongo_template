import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "@typings/express";
import { UnauthorizedError } from "@errors/AppError";
import config from "@config/config";
import { ERROR_CODES } from "@constants/errorCodes";

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "No token provided or invalid format",
        ERROR_CODES.NO_TOKEN
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as {
        userId: string;
      };

      // Attach user info to request
      req.user = {
        id: decoded.userId,
        email: "", // Will be fetched from DB if needed
      };

      next();
    } catch (jwtError: any) {
      if (jwtError.name === "JsonWebTokenError") {
        throw new UnauthorizedError("Invalid token", ERROR_CODES.INVALID_TOKEN);
      }

      if (jwtError.name === "TokenExpiredError") {
        throw new UnauthorizedError("Token expired", ERROR_CODES.TOKEN_EXPIRED);
      }

      throw jwtError;
    }
  } catch (error) {
    next(error);
  }
}
