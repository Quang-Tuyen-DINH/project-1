import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controller/todo.controller';


const router = Router();

router.get("/todos", getTodos);

router.post(
  "/todos",
  [
    body("text").isString().notEmpty().withMessage("Text is required"),
    body("completed").isBoolean().withMessage("Completed must be a boolean")
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    createTodo(req, res);
  });

router.put(
  "/todos/:id",
  [
    body("text").isString().notEmpty().withMessage("Text is required"),
    body("completed").isBoolean().withMessage("Completed must be a boolean")
  ],
  (req: any, res: any) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }

    updateTodo(req, res);
  });

router.delete("/todos/:id", deleteTodo);

export default router;