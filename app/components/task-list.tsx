"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Edit, Trash2, ChevronDown, ChevronRight, Sparkles, Calendar } from "lucide-react"
import type { Task, Subtask } from "../page"

interface TaskListProps {
  tasks: Task[]
  onToggleStatus: (taskId: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
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

const urgencyColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-purple-100 text-purple-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
}

export function TaskList({ tasks, onToggleStatus, onEdit, onDelete, onUpdate }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
    )

    onUpdate(taskId, { subtasks: updatedSubtasks })
  }

  const getEffortLabel = (effort: number) => {
    const labels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    return labels[effort] || "Unknown"
  }

  const getSubtaskProgress = (subtasks: Subtask[]) => {
    if (subtasks.length === 0) return 0
    const completed = subtasks.filter((st) => st.completed).length
    return (completed / subtasks.length) * 100
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 text-center">Create your first task or adjust your filters to see tasks here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isExpanded = expandedTasks.has(task.id)
        const subtaskProgress = getSubtaskProgress(task.subtasks)
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed"

        return (
          <Card
            key={task.id}
            className={`transition-all duration-200 ${
              task.status === "Completed" ? "opacity-75" : ""
            } ${isOverdue ? "border-red-200 bg-red-50" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={task.status === "Completed"}
                    onCheckedChange={() => onToggleStatus(task.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{categoryIcons[task.category]}</span>
                      <h3
                        className={`font-semibold text-lg ${
                          task.status === "Completed" ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.aiEnhanced && <Sparkles className="w-4 h-4 text-blue-500" title="AI Enhanced" />}
                    </div>

                    {task.description && <p className="text-gray-600 mb-3">{task.description}</p>}

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={priorityColors[task.priority]}>{task.priority} Priority</Badge>
                      <Badge className={urgencyColors[task.urgency]}>{task.urgency} Urgency</Badge>
                      <Badge variant="outline">{getEffortLabel(task.effort)}</Badge>
                      <Badge variant="outline">{task.category}</Badge>
                      {task.dueDate && (
                        <Badge variant="outline" className={isOverdue ? "border-red-500 text-red-700" : ""}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>

                    {task.subtasks.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            Subtasks ({task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length})
                          </span>
                          <span className="text-sm text-gray-600">{subtaskProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={subtaskProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {task.subtasks.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => toggleExpanded(task.id)}>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isExpanded && task.subtasks.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2 pl-6 border-l-2 border-gray-200">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                        size="sm"
                      />
                      <span className={`text-sm ${subtask.completed ? "line-through text-gray-500" : ""}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
