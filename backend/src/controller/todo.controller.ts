import { Request, Response } from "express";
import { Todo } from "../models/todo.model";
import { validationResult } from "express-validator";
import "../types/express.d.ts";

let todos: Todo[] = [];

// GET /todos - Retrieve all todos (admin can see all, normal users can see their own)
export const getTodos = (req: Request, res: Response): void => {
  const { completed, page = 1, limit = 10 } = req.query;

  let filteredTodos = todos;

  // Normal can only see their own todos
  if (req.user?.role !== "admin") {
    filteredTodos = todos.filter((todo) => todo.userId === req.user?.userId);
  }

  if (completed !== undefined) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed === (completed === "true")
    );
  }

  const start = (parseInt(page as string) - 1) * parseInt(limit as string);
  const end = start + parseInt(limit as string);

  const paginatedTodos = filteredTodos.slice(start, end);

  res.json({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    total: filteredTodos.length,
    todos: paginatedTodos,
  });
};

// POST /todos - Create a new todo for the authenticated user
export const createTodo = (req: Request, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { text, completed }: { text: string; completed: boolean } = req.body;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    userId: req.user?.userId ?? "No userId",
    text,
    completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req: Request, res: Response): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { text, completed }: { text: string; completed: boolean } = req.body;

  const todo: Todo | undefined = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ message: "Todo not found" });
    return;
  }

  // Check if the user is authorized to update this todo
  if (todo.userId !== req.user?.userId && req.user?.role !== "admin") {
    res.status(403).json({ message: "You can only update your own todos" });
  }

  todo.text = text;
  todo.completed = completed;
  todo.updatedAt = new Date();

  res.json(todo);
};

// DELETE /todos/:id - Delete a todo
export const deleteTodo = (req: Request, res: Response): void => {
  const { id } = req.params;

  const index: number = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    res.status(404).json({ message: "Todo not found" });
  }

  const todo = todos[index];

  // Check if the user is authorized to delete this todo
  if (todo.userId !== req.user?.userId && req.user?.role !== "admin") {
    res.status(403).json({ message: "You can only delete your own todos" });
  }

  todos.splice(index, 1);
  res.status(204).send();
};
