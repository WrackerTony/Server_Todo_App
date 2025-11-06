import { useRef } from "react";
import { useTodos, type SortType } from "./use-todos";
import { ListTodoIcon, Trash2, ArrowUpDown } from "lucide-react";

export default function App() {
  const { todos, addTodo, toggleTodoCompletion, removeTodo, sortType, setSortType, isLoading, error } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(data: FormData) {
    const title = data.get("title") as string;
    addTodo(title);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  if (isLoading) return <p>Loading todos...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-title">
          <ListTodoIcon size={32} strokeWidth={2.5} />
          <h1>Todo App</h1>
        </div>
        <p className="task-count">{todos.length} {todos.length === 1 ? 'task' : 'tasks'}</p>
      </div>

      <form action={onSubmit} className="add-todo-form">
        <input 
          ref={inputRef}
          name="title" 
          type="text" 
          placeholder="Add a new task..." 
          className="todo-input"
        />
        <button type="submit" className="btn-add">Add Task</button>
      </form>

      <div className="sort-controls">
        <ArrowUpDown size={18} />
        <span className="sort-label">Sort by:</span>
        <select 
          value={sortType} 
          onChange={(e) => setSortType(e.target.value as SortType)}
          className="sort-select"
          aria-label="Sort tasks"
        >
          <option value="a-z">A to Z</option>
          <option value="z-a">Z to A</option>
          <option value="completed">Completed First</option>
          <option value="uncompleted">Uncompleted First</option>
        </select>
      </div>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="empty-state">
            <p>No tasks yet.</p>
          </li>
        ) : (
          todos.map((todo) => (
            <li key={todo.uuid} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label className="todo-label">
                <input 
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.uuid)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.title}</span>
              </label>
              <button 
                onClick={() => removeTodo(todo.uuid)}
                className="btn-delete"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}