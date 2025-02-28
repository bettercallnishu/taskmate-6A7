"use client"

import { useState } from "react"
import type { Task } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, X, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { updateTask, deleteTask } from "@/lib/tasks"

interface TaskItemProps {
  task: Task
  onTaskUpdated: () => Promise<void>
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleComplete = async () => {
    setIsLoading(true)
    await updateTask({
      ...task,
      completed: !task.completed,
    })
    await onTaskUpdated()
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await deleteTask(task.id)
    await onTaskUpdated()
    setIsLoading(false)
  }

  const handleSaveEdit = async () => {
    if (editedTitle.trim() === "") return

    setIsLoading(true)
    await updateTask({
      ...task,
      title: editedTitle,
    })
    setIsEditing(false)
    await onTaskUpdated()
    setIsLoading(false)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          {!isEditing ? (
            <>
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggleComplete}
                disabled={isLoading}
                className="mr-3"
              />
              <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} disabled={isLoading}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isLoading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 mr-2"
                autoFocus
              />
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveEdit}
                  disabled={isLoading || editedTitle.trim() === ""}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedTitle(task.title)
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

