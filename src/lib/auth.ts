import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { JWTPayload } from "@/src/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

export function signToken(payload: JWTPayload): string {
  const expiry = process.env.JWT_EXPIRY || "7d";
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry as any });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
