import TaskList from "@/components/task-list"
import AddTask from "@/components/add-task"
import { getTasks } from "@/lib/tasks"

export default async function Home() {
  const tasks = await getTasks()

  return (
    <main className="container mx-auto py-6 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>
      <div className="grid gap-8">
        <AddTask />
        <TaskList initialTasks={tasks} />
      </div>
    </main>
  )
}

