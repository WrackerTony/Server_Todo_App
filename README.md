# Todo List App

A full-stack todo list application built with React (frontend) and Hono (backend).


## Features

- Add new tasks
- Mark tasks as completed/uncompleted
- Delete tasks
- Sort tasks by:
  - Alphabetical (A-Z or Z-A)
  - Completion status (completed first or uncompleted first)
- Persistent storage using JSON file

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TanStack React Query for API state management
- Lucide React for icons
- CSS for styling

### Backend
- Hono (web framework)
- TypeScript
- Bun runtime
- JSON file storage

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Bun (for backend)


### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   bun run index.ts
   ```
   The backend will run on http://localhost:3000

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. Open your browser and navigate to http://localhost:5173

### API Endpoints

The backend provides the following REST API endpoints:

- `GET /todo` - Get all todos
- `POST /todo` - Create a new todo (body: `{ "title": "string" }`)
- `PUT /todo/:uuid` - Update todo completion status (body: `{ "completed": boolean }`)
- `DELETE /todo/:uuid` - Delete a todo

## Screenshot

![Todo List App](screenshot.png)

