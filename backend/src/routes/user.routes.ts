import { Router } from "express";
import { body, validationResult } from "express-validator";
import { comparePassword, generateToken, hashPassword } from "../utils/auth";

const router = Router();

let users: { id: string; username: string; password: string; role: string }[] =
  [];

router.post(
  "/register",
  [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .notEmpty()
      .withMessage("Password is required and must be longer than 6 characters"),
  ],
  async (req: any, res: any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: `${"user-" + new Date().toISOString()}`,
      username,
      password: hashedPassword,
      role: "user", // Default role is "user"
    };

    users.push(newUser);

    const token = generateToken(newUser.id, newUser.role);
    res.status(201).json({ token });
  }
);

router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id, user.role);
  res.json({ token });
});

export default router;
