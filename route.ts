import { type NextRequest, NextResponse } from "next/server"
import { getTasks, addTask, updateTask, deleteTask } from "@/lib/tasks"
import type { Task } from "@/types"

// GET all tasks
export async function GET() {
  try {
    const tasks = await getTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST a new task
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTask = await addTask(title)
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

// PUT to update a task
export async function PUT(request: NextRequest) {
  try {
    const task: Task = await request.json()

    if (!task.id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const updatedTask = await updateTask(task)
    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE a task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    await deleteTask(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}

