"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, AlertCircle, CheckCircle2, Brain, Sun, Sunset, Moon } from "lucide-react"
import type { Task } from "../page"

interface DailyPlannerProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

export function DailyPlanner({ tasks, onUpdateTask }: DailyPlannerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const today = new Date().toDateString()
  const selectedDateObj = new Date(selectedDate)
  const isToday = selectedDateObj.toDateString() === today

  // Filter tasks for selected date
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false
    return new Date(task.dueDate).toDateString() === selectedDateObj.toDateString()
  })

  // Get high priority tasks that aren't completed
  const highPriorityTasks = tasks
    .filter((task) => (task.priority === "High" || task.priority === "Critical") && task.status !== "Completed")
    .slice(0, 3)

  // Get overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") return false
    return new Date(task.dueDate) < new Date()
  })

  const toggleTaskStatus = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newStatus = task.status === "Completed" ? "Todo" : "Completed"
    onUpdateTask(taskId, {
      status: newStatus,
      completedAt: newStatus === "Completed" ? new Date().toISOString() : undefined,
    })
  }

  const getTimeRecommendation = (task: Task) => {
    const category = task.category.toLowerCase()
    const effort = task.effort

    if (category.includes("work") || category.includes("study")) {
      return effort >= 4 ? "Morning (High Focus)" : "Morning/Afternoon"
    } else if (category.includes("communication")) {
      return "Business Hours"
    } else if (category.includes("health") || category.includes("exercise")) {
      return "Morning/Evening"
    } else {
      return effort >= 4 ? "When Energy is High" : "Flexible"
    }
  }

  const getAIRecommendations = () => {
    const recommendations = []

    if (overdueTasks.length > 0) {
      recommendations.push({
        type: "urgent",
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        title: "Address Overdue Tasks",
        description: `You have ${overdueTasks.length} overdue tasks. Consider rescheduling or completing them first.`,
      })
    }

    if (todayTasks.length > 5) {
      recommendations.push({
        type: "workload",
        icon: <Clock className="w-4 h-4 text-orange-500" />,
        title: "Heavy Workload Today",
        description: "Consider rescheduling non-urgent tasks to maintain quality and avoid burnout.",
      })
    }

    if (highPriorityTasks.length > 0) {
      recommendations.push({
        type: "priority",
        icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
        title: "Focus on High Priority",
        description: `Start with "${highPriorityTasks[0].title}" during your peak energy hours.`,
      })
    }

    const highEffortTasks = todayTasks.filter((t) => t.effort >= 4)
    if (highEffortTasks.length > 0) {
      recommendations.push({
        type: "energy",
        icon: <Sun className="w-4 h-4 text-yellow-500" />,
        title: "Schedule Demanding Tasks Early",
        description: "Tackle high-effort tasks when your energy and focus are at their peak.",
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: "positive",
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
        title: "Well Balanced Day",
        description: "Your schedule looks manageable. Great job on task planning!",
      })
    }

    return recommendations
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Daily Planner
          </CardTitle>
          <CardDescription>Plan and organize your day with AI-powered recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            {isToday && (
              <Badge variant="outline" className="text-blue-600">
                Today
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {selectedDateObj.toLocaleDateString()}</CardTitle>
              <CardDescription>{todayTasks.length} tasks scheduled for this day</CardDescription>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Checkbox
                        checked={task.status === "Completed"}
                        onCheckedChange={() => toggleTaskStatus(task.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{categoryIcons[task.category]}</span>
                          <h3
                            className={`font-medium ${task.status === "Completed" ? "line-through text-gray-500" : ""}`}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {task.description && <p className="text-sm text-gray-600 mb-2">{task.description}</p>}

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                          <Badge variant="outline">{task.category}</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Best time: {getTimeRecommendation(task)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {overdueTasks.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Overdue Tasks
                </CardTitle>
                <CardDescription className="text-red-600">These tasks need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryIcons[task.category]}</span>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => toggleTaskStatus(task.id)}>
                        Mark Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Smart suggestions for your day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAIRecommendations().map((rec, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {rec.icon}
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High Priority Tasks</CardTitle>
              <CardDescription>Focus on these important items</CardDescription>
            </CardHeader>
            <CardContent>
              {highPriorityTasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No high priority tasks pending</p>
              ) : (
                <div className="space-y-3">
                  {highPriorityTasks.map((task) => (
                    <div key={task.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{categoryIcons[task.category]}</span>
                        <p className="font-medium text-sm">{task.title}</p>
                      </div>
                      <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Energy Planning</CardTitle>
              <CardDescription>Optimize your schedule by energy levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Sun className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-sm">Morning (High Energy)</p>
                  <p className="text-xs text-gray-600">Complex tasks, creative work</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Sunset className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Afternoon (Medium Energy)</p>
                  <p className="text-xs text-gray-600">Meetings, routine tasks</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Moon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Evening (Low Energy)</p>
                  <p className="text-xs text-gray-600">Planning, light tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
