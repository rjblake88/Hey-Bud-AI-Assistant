interface Todo {
  id: string
  content: string
  completed: boolean
  timestamp: string
}

// Get all todos from local storage
export function getTodos(): Todo[] {
  if (typeof window === "undefined") return []

  const todosJson = localStorage.getItem("todos")
  if (!todosJson) return []

  try {
    const todos = JSON.parse(todosJson) as Todo[]
    return todos.sort((a, b) => {
      // Sort by completion status first (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      // Then sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  } catch (error) {
    console.error("Error parsing todos:", error)
    return []
  }
}

// Add a new todo
export function addTodo(content: string): Todo {
  const todos = getTodos()

  // Check if this todo already exists
  const existingTodo = todos.find((todo) => todo.content.toLowerCase() === content.toLowerCase() && !todo.completed)

  if (existingTodo) {
    return existingTodo
  }

  const newTodo: Todo = {
    id: generateId(),
    content,
    completed: false,
    timestamp: new Date().toISOString(),
  }

  const updatedTodos = [newTodo, ...todos]
  saveTodos(updatedTodos)

  return newTodo
}

// Toggle todo completion status
export function toggleTodo(id: string): void {
  const todos = getTodos()
  const todoIndex = todos.findIndex((todo) => todo.id === id)

  if (todoIndex !== -1) {
    todos[todoIndex] = {
      ...todos[todoIndex],
      completed: !todos[todoIndex].completed,
    }

    saveTodos(todos)
  }
}

// Delete a todo
export function deleteTodo(id: string): void {
  const todos = getTodos()
  const filteredTodos = todos.filter((todo) => todo.id !== id)
  saveTodos(filteredTodos)
}

// Save todos to local storage
function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem("todos", JSON.stringify(todos))

  // Dispatch a custom event to notify subscribers
  window.dispatchEvent(new CustomEvent("todosUpdated"))
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
