interface Note {
  id: string
  content: string
  timestamp: string
}

// Get all notes from local storage
export function getNotes(): Note[] {
  if (typeof window === "undefined") return []

  const notesJson = localStorage.getItem("notes")
  if (!notesJson) return []

  try {
    const notes = JSON.parse(notesJson) as Note[]
    return notes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error("Error parsing notes:", error)
    return []
  }
}

// Add a new note
export function addNote(content: string): Note {
  const notes = getNotes()

  const newNote: Note = {
    id: generateId(),
    content,
    timestamp: new Date().toISOString(),
  }

  const updatedNotes = [newNote, ...notes]
  saveNotes(updatedNotes)

  return newNote
}

// Update an existing note
export function updateNote(id: string, content: string): void {
  const notes = getNotes()
  const noteIndex = notes.findIndex((note) => note.id === id)

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      content,
    }

    saveNotes(notes)
  }
}

// Delete a note
export function deleteNote(id: string): void {
  const notes = getNotes()
  const filteredNotes = notes.filter((note) => note.id !== id)
  saveNotes(filteredNotes)
}

// Save notes to local storage
function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem("notes", JSON.stringify(notes))

  // Dispatch a custom event to notify subscribers
  window.dispatchEvent(new CustomEvent("notesUpdated"))
}

// Generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
