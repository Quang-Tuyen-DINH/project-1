import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

interface AuthRequest extends Request {
  user?: jwt.JwtPayload | string;
}

// Secret key for JWT (should be in .env in a real app)
const SECRET_KEY = "1stSecretKey_!";

// Generate JWT for a user
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: "1h" });
};

// Middleware to verify JWT and attach user information to the request
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Function to hash passwords
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
};

// Function to compare passwords
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
