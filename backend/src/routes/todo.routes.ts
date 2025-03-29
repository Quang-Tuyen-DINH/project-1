import { Router } from 'express';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controller/todo.controller';


const router = Router();
router.get("/todos", getTodos);
router.post("/todos", createTodo);
router.put("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

export default router;