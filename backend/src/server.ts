import express from "express";
import todosRouter from "./routes/todo.routes";

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.use("/api", todosRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
