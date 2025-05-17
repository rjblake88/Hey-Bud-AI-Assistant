"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { getTodos, toggleTodo, deleteTodo } from "@/lib/todos"

interface Todo {
  id: string
  content: string
  completed: boolean
  timestamp: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // Load todos from local storage
    const loadedTodos = getTodos()
    setTodos(loadedTodos)

    // Subscribe to storage events to update todos when they change
    const handleStorageChange = () => {
      setTodos(getTodos())
    }

    window.addEventListener("todosUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("todosUpdated", handleStorageChange)
    }
  }, [])

  const handleToggle = (id: string) => {
    toggleTodo(id)
    setTodos(getTodos())
  }

  const handleDelete = (id: string) => {
    deleteTodo(id)
    setTodos(getTodos())
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-2">No to-dos yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Tasks will be extracted from your notes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start p-3 rounded-md ${
                todo.completed ? "bg-slate-50 dark:bg-slate-900" : "bg-white dark:bg-slate-800"
              }`}
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => handleToggle(todo.id)}
                className="mt-0.5"
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`ml-2 text-sm flex-1 ${
                  todo.completed
                    ? "text-slate-500 dark:text-slate-400 line-through"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {todo.content}
              </label>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-red-500 ml-2"
                onClick={() => handleDelete(todo.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
