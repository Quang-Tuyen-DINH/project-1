import { NextFunction, Router } from "express";
import { body, validationResult } from "express-validator";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo.controller";
import { verifyToken } from "../utils/auth";

const router = Router();

// Middleware for authorizaiton (check user roles)
const isAdmin = (req: any, res: any, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Permission denied" });
  }
  next();
};

// GET /todos - Retrieve all todos (admin can list all, user can list own)
router.get("/todos", verifyToken, getTodos);

// POST /todos - Create a new todo (any user can create a todo for themselves)
router.post(
  "/todos",
  verifyToken,
  [
    body("text").isString().notEmpty().withMessage("Text is required"),
    body("completed").isBoolean().withMessage("Completed must be a boolean"),
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    createTodo(req, res);
  }
);

// PUT /todos/:id - Update an existing todo (user can update only their own todos)
router.put(
  "/todos/:id",
  verifyToken,
  [
    body("text").isString().notEmpty().withMessage("Text is required"),
    body("completed").isBoolean().withMessage("Completed must be a boolean"),
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    updateTodo(req, res);
  }
);

// DELETE /todos/:id - Delete a todo (admin can delete any, user can delete only their own)
router.delete("/todos/:id", verifyToken, deleteTodo);

// DELETE /todos - Admin can delete multiple todos
router.delete("/todos", verifyToken, isAdmin, deleteTodo);

export default router;
