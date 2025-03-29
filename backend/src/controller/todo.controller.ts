import { Request, Response } from 'express';
import { Todo } from '../models/todo.model';

let todos: Todo[] = [];

export const getTodos = (req: Request, res: Response): void => {
  res.json(todos);
};

export const createTodo = (req: Request, res: Response): void => {
  const { text, completed }: {text: string, completed: boolean} = req.body;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
    completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { text, completed }: {text: string, completed: boolean} = req.body;
  
  const todo: Todo | undefined = todos.find(todo => todo.id === id);
  
  if (!todo) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }

  todo.text = text;
  todo.completed = completed;
  todo.updatedAt = new Date();

  res.json(todo);
};

export const deleteTodo = (req: Request, res: Response): void => {
  const { id } = req.params;

  const index:number = todos.findIndex(todo => todo.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(204).send();
};