import { Request, Response, NextFunction } from "express";
import config from "@config";

/**
 * CORS middleware that validates origins against a whitelist
 * and handles preflight requests
 */
export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.headers.origin;
  const allowedOrigins = config.FRONTEND_ORIGINS;

  // Check if origin is in whitelist
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
    res.status(204).end();
    return;
  }

  next();
}
