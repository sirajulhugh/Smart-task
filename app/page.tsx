"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Brain,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Sparkles,
  Target,
  Calendar,
  TrendingUp,
  LogOut,
} from "lucide-react"
import { TaskList } from "./components/task-list"
import { TaskForm } from "./components/task-form"
import { AIAssistant } from "./components/ai-assistant"
import { Analytics } from "./components/analytics"
import { DailyPlanner } from "./components/daily-planner"
import { AuthForm } from "./components/auth-form"

export interface Task {
  id: string
  title: string
  description: string
  category: "Work" | "Personal" | "Health" | "Study" | "Communication" | "Errands"
  priority: "Low" | "Medium" | "High" | "Critical"
  urgency: "Low" | "Medium" | "High" | "Critical"
  effort: number // 1-5 scale
  status: "Todo" | "In Progress" | "Completed"
  dueDate?: string
  subtasks: Subtask[]
  createdAt: string
  completedAt?: string
  aiEnhanced?: boolean
  originalTitle?: string
  userId?: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

const categoryIcons = {
  Work: "💼",
  Personal: "🏠",
  Health: "🧘",
  Study: "📚",
  Communication: "📞",
  Errands: "🛠️",
}

const priorityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function SmartTaskAI() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<{
    category?: string
    priority?: string
    status?: string
  }>({ category: "all", priority: "all", status: "all" })

  // Check authentication status
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load tasks from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  const loadTasks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading tasks:", error)
        // Show user-friendly error message
        return
      }

      if (data) {
        const formattedTasks: Task[] = data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          category: task.category,
          priority: task.priority,
          urgency: task.urgency,
          effort: task.effort,
          status: task.status,
          dueDate: task.due_date,
          subtasks: task.subtasks || [],
          createdAt: task.created_at,
          completedAt: task.completed_at,
          aiEnhanced: task.ai_enhanced,
          originalTitle: task.original_title,
          userId: task.user_id,
        }))

        setTasks(formattedTasks)
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return

    const newTask = {
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      urgency: task.urgency,
      effort: task.effort,
      status: task.status,
      due_date: task.dueDate,
      subtasks: task.subtasks,
      ai_enhanced: task.aiEnhanced,
      original_title: task.originalTitle,
      user_id: user.id,
    }

    try {
      const { data, error } = await supabase.from("tasks").insert([newTask]).select().single()

      if (error) {
        console.error("Error adding task:", error)
        return
      }

      const formattedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        category: data.category,
        priority: data.priority,
        urgency: data.urgency,
        effort: data.effort,
        status: data.status,
        dueDate: data.due_date,
        subtasks: data.subtasks || [],
        createdAt: data.created_at,
        completedAt: data.completed_at,
        aiEnhanced: data.ai_enhanced,
        originalTitle: data.original_title,
        userId: data.user_id,
      }

      setTasks((prev) => [formattedTask, ...prev])
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return

    const updateData: any = {}
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.priority !== undefined) updateData.priority = updates.priority
    if (updates.urgency !== undefined) updateData.urgency = updates.urgency
    if (updates.effort !== undefined) updateData.effort = updates.effort
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate
    if (updates.subtasks !== undefined) updateData.subtasks = updates.subtasks
    if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt
    if (updates.aiEnhanced !== undefined) updateData.ai_enhanced = updates.aiEnhanced
    if (updates.originalTitle !== undefined) updateData.original_title = updates.originalTitle

    try {
      const { error } = await supabase.from("tasks").update(updateData).eq("id", taskId).eq("user_id", user.id)

      if (error) {
        console.error("Error updating task:", error)
        return
      }

      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", user.id)

      if (error) {
        console.error("Error deleting task:", error)
        return
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newStatus = task.status === "Completed" ? "Todo" : "Completed"
    const updates: Partial<Task> = {
      status: newStatus,
      completedAt: newStatus === "Completed" ? new Date().toISOString() : undefined,
    }

    updateTask(taskId, updates)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter.category && filter.category !== "all" && task.category !== filter.category) return false
    if (filter.priority && filter.priority !== "all" && task.priority !== filter.priority) return false
    if (filter.status && filter.status !== "all" && task.status !== filter.status) return false
    return true
  })

  const completedTasks = tasks.filter((task) => task.status === "Completed").length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const highPriorityTasks = tasks.filter(
    (task) => (task.priority === "High" || task.priority === "Critical") && task.status !== "Completed",
  ).length

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false
    const today = new Date().toDateString()
    const taskDate = new Date(task.dueDate).toDateString()
    return today === taskDate && task.status !== "Completed"
  }).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading SmartTaskAI...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Brain className="w-10 h-10 text-blue-600" />
              SmartTaskAI
            </h1>
            <p className="text-gray-600">Your Intelligent Task Manager & Assistant</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily Planner
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">{completedTasks} completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
                  <Progress value={completionRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
                  <p className="text-xs text-muted-foreground">Urgent tasks pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Due Today</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{todayTasks}</div>
                  <p className="text-xs text-muted-foreground">Tasks due today</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Your latest task activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No tasks yet. Create your first task to get started!</p>
                      </div>
                    ) : (
                      tasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{categoryIcons[task.category]}</span>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground">{task.category}</p>
                            </div>
                          </div>
                          <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setIsTaskFormOpen(true)} className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                  <Button
                    onClick={() => setActiveTab("ai-assistant")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Get AI Help
                  </Button>
                  <Button onClick={() => setActiveTab("planner")} className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Plan Your Day
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filter.category || "all"}
                  onValueChange={(value) => setFilter((prev) => ({ ...prev, category: value === "all" ? "" : value }))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Work">💼 Work</SelectItem>
                    <SelectItem value="Personal">🏠 Personal</SelectItem>
                    <SelectItem value="Health">🧘 Health</SelectItem>
                    <SelectItem value="Study">📚 Study</SelectItem>
                    <SelectItem value="Communication">📞 Communication</SelectItem>
                    <SelectItem value="Errands">🛠️ Errands</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.priority || "all"}
                  onValueChange={(value) => setFilter((prev) => ({ ...prev, priority: value === "all" ? "" : value }))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.status || "all"}
                  onValueChange={(value) => setFilter((prev) => ({ ...prev, status: value === "all" ? "" : value }))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Todo">Todo</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setIsTaskFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            <TaskList
              tasks={filteredTasks}
              onToggleStatus={toggleTaskStatus}
              onEdit={(task) => {
                setEditingTask(task)
                setIsTaskFormOpen(true)
              }}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant tasks={tasks} onUpdateTask={updateTask} onAddTask={addTask} />
          </TabsContent>

          <TabsContent value="planner">
            <DailyPlanner tasks={tasks} onUpdateTask={updateTask} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics tasks={tasks} />
          </TabsContent>
        </Tabs>

        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              <DialogDescription>
                {editingTask ? "Update your task details" : "Add a new task to your list"}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              <TaskForm
                task={editingTask}
                onSubmit={(task) => {
                  if (editingTask) {
                    updateTask(editingTask.id, task)
                  } else {
                    addTask(task)
                  }
                  setIsTaskFormOpen(false)
                  setEditingTask(null)
                }}
                onCancel={() => {
                  setIsTaskFormOpen(false)
                  setEditingTask(null)
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
