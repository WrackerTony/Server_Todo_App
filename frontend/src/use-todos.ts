import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TodoItem = {
  uuid: string;
  title: string;
  completed: boolean;
};

export type SortType = "a-z" | "z-a" | "completed" | "uncompleted";

const API_BASE = "http://localhost:3000";

async function fetchTodos(): Promise<TodoItem[]> {
  const response = await fetch(`${API_BASE}/todo`);
  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
}

async function addTodoApi(title: string): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/todo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error("Failed to add todo");
  return response.json();
}

async function deleteTodoApi(uuid: string): Promise<void> {
  const response = await fetch(`${API_BASE}/todo/${uuid}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete todo");
}

async function toggleTodoApi(uuid: string, completed: boolean): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/todo/${uuid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error("Failed to toggle todo");
  return response.json();
}

export function useTodos() {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const [sortType, setSortType] = useState<SortType>("a-z");

  const addMutation = useMutation({
    mutationFn: addTodoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteTodoApi(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ uuid, completed }: { uuid: string; completed: boolean }) => toggleTodoApi(uuid, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  function addTodo(title: string) {
    if (!title.trim()) return;
    addMutation.mutate(title.trim());
  }

  function toggleTodoCompletion(uuid: string) {
    const todo = todos.find(t => t.uuid === uuid);
    if (!todo) return;
    toggleMutation.mutate({ uuid, completed: !todo.completed });
  }

  function removeTodo(uuid: string) {
    deleteMutation.mutate(uuid);
  }

  function getSortedTodos() {
    const todosCopy = [...todos];

    switch (sortType) {
      case "a-z":
        return todosCopy.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      case "z-a":
        return todosCopy.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
      case "completed":
        return todosCopy.sort((a, b) => Number(b.completed) - Number(a.completed));
      case "uncompleted":
        return todosCopy.sort((a, b) => Number(a.completed) - Number(b.completed));
      default:
        return todosCopy;
    }
  }

  return {
    todos: getSortedTodos(),
    addTodo,
    toggleTodoCompletion,
    removeTodo,
    sortType,
    setSortType,
    isLoading,
    error,
  };
}
