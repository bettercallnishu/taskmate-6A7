"use server"

import type { Task } from "@/types"
import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const dataFilePath = path.join(process.cwd(), "data", "tasks.json")

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read tasks from JSON file
export async function getTasks(): Promise<Task[]> {
  await ensureDataDirectory()

  try {
    const data = await fs.readFile(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return []
  }
}

// Write tasks to JSON file
async function saveTasks(tasks: Task[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(dataFilePath, JSON.stringify(tasks, null, 2), "utf8")
}

// Add a new task
export async function addTask(title: string): Promise<Task> {
  const tasks = await getTasks()

  const newTask: Task = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  await saveTasks(tasks)

  return newTask
}

// Update an existing task
export async function updateTask(updatedTask: Task): Promise<Task> {
  const tasks = await getTasks()

  const index = tasks.findIndex((task) => task.id === updatedTask.id)

  if (index !== -1) {
    tasks[index] = updatedTask
    await saveTasks(tasks)
    return updatedTask
  }

  throw new Error(`Task with ID ${updatedTask.id} not found`)
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  const tasks = await getTasks()

  const filteredTasks = tasks.filter((task) => task.id !== id)

  if (filteredTasks.length < tasks.length) {
    await saveTasks(filteredTasks)
    return
  }

  throw new Error(`Task with ID ${id} not found`)
}

