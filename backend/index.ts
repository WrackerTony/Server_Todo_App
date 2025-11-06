import { writeFile, exists, readFile } from "fs/promises";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { join } from "path";
import { randomUUID } from "node:crypto";

const todoFile = join(__dirname, "todos.json");

type Todo = {
  uuid: string;
  title: string;
  completed: boolean;
};

async function saveTodos(todos: Todo[]) {
  await writeFile(todoFile, JSON.stringify(todos, null, 2), "utf-8");
}

async function listTodos(): Promise<Todo[]> {
  if (!(await exists(todoFile))) {
    await saveTodos([]);
    return [];
  }
  return JSON.parse(await readFile(todoFile, "utf-8")) as Todo[];
}

async function addTodo(title: string): Promise<Todo> {
  const todos = await listTodos();
  const newTodo: Todo = { uuid: randomUUID(), title, completed: false };
  todos.push(newTodo);
  await saveTodos(todos);
  return newTodo;
}

async function removeTodo(uuid: string): Promise<boolean> {
  const todos = await listTodos();
  const index = todos.findIndex(t => t.uuid === uuid);
  if (index === -1) return false;
  todos.splice(index, 1);
  await saveTodos(todos);
  return true;
}

const app = new Hono();

app.use('*', cors());

app.get("/todo", async (c) => {
  try {
    const todos = await listTodos();
    return c.json(todos);
  } catch (error) {
    return c.json({ error: "Failed to load todos" }, 500);
  }
});

app.post("/todo", async (c) => {
  try {
    const { title } = await c.req.json<{ title: string }>();
    if (!title) {
      return c.json({ error: "Title is required" }, 400);
    }
    const newTodo = await addTodo(title);
    return c.json(newTodo, 201);
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

app.put("/todo/:uuid", async (c) => {
  try {
    const uuid = c.req.param("uuid");
    const { completed } = await c.req.json<{ completed: boolean }>();
    const todos = await listTodos();
    const index = todos.findIndex(t => t.uuid === uuid);
    if (index === -1) {
      return c.json({ error: "Todo not found" }, 404);
    }
    todos[index]!.completed = completed;
    await saveTodos(todos);
    return c.json(todos[index]);
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

app.delete("/todo/:uuid", async (c) => {
  try {
    const uuid = c.req.param("uuid");
    const success = await removeTodo(uuid);
    if (!success) {
      return c.json({ error: "Todo not found" }, 404);
    }
    return c.json({ message: "Todo deleted" });
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
