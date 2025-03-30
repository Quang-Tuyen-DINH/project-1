import express from "express";
import todosRouter from "./routes/todo.routes";

const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON request bodies

app.use("/api", todosRouter)

// Global error handling Middleware
app.use((err: any, req: any, res: any, nex: any) => {
  console.error(err.stack); // Log error for debugging
  res.status(500).json({ mess: "Internal Server Error"});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
