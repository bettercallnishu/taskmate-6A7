"use client"

import { useState } from "react"
import type { Task } from "@/types"
import TaskItem from "./task-item"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTasks } from "@/lib/tasks"

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // Refresh tasks when needed
  const refreshTasks = async () => {
    const updatedTasks = await getTasks()
    setTasks(updatedTasks)
  }

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No tasks found. Add some tasks to get started!</div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onTaskUpdated={refreshTasks} />
          ))}
        </div>
      )}

      <div className="text-sm text-muted-foreground mt-4">
        {tasks.length} total tasks • {tasks.filter((t) => !t.completed).length} active •{" "}
        {tasks.filter((t) => t.completed).length} completed
      </div>
    </div>
  )
}

