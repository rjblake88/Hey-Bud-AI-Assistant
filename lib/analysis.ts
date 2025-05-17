import { addTodo } from "./todos"
import { getAIProvider } from "./ai-service"

export async function analyzeText(text: string): Promise<void> {
  try {
    // Use the AI provider to analyze the text and extract todos
    const aiProvider = getAIProvider()
    const todos = await aiProvider.analyzeText(text)

    // Add each extracted todo to the todo list
    todos.forEach((todo) => {
      addTodo(todo)
    })

    return
  } catch (error) {
    console.error("Analysis error:", error)
    throw new Error("Failed to analyze text")
  }
}
