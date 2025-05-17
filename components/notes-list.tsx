"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit, Save, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { getNotes, deleteNote, updateNote } from "@/lib/notes"

interface Note {
  id: string
  content: string
  timestamp: string
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    // Load notes from local storage
    const loadedNotes = getNotes()
    setNotes(loadedNotes)

    // Subscribe to storage events to update notes when they change
    const handleStorageChange = () => {
      setNotes(getNotes())
    }

    window.addEventListener("notesUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("notesUpdated", handleStorageChange)
    }
  }, [])

  const handleEdit = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleSave = (id: string) => {
    updateNote(id, editContent)
    setEditingId(null)
    setNotes(getNotes())
  }

  const handleDelete = (id: string) => {
    deleteNote(id)
    setNotes(getNotes())
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-2">No notes yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Use the microphone to create a note</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="bg-white dark:bg-slate-800">
              <CardContent className="p-4">
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex space-x-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSave(note.id)}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(note.timestamp)}</span>
                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEdit(note)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-red-500"
                          onClick={() => handleDelete(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.content}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  )
}
