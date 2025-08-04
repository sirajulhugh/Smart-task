"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Clock, Target, Calendar, CheckCircle2 } from "lucide-react"
import type { Task } from "../page"

interface AnalyticsProps {
  tasks: Task[]
}

export function Analytics({ tasks }: AnalyticsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "Completed").length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Category breakdown
  const categoryStats = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryCompletionStats = tasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = { total: 0, completed: 0 }
      }
      acc[task.category].total++
      if (task.status === "Completed") {
        acc[task.category].completed++
      }
      return acc
    },
    {} as Record<string, { total: number; completed: number }>,
  )

  // Priority breakdown
  const priorityStats = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Effort analysis
  const effortStats = tasks.reduce(
    (acc, task) => {
      const effort = task.effort
      acc[effort] = (acc[effort] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const averageEffort = tasks.length > 0 ? tasks.reduce((sum, task) => sum + task.effort, 0) / tasks.length : 0

  // Streak calculation (simplified)
  const getCompletionStreak = () => {
    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    while (streak < 30) {
      // Check last 30 days max
      const dateStr = currentDate.toDateString()
      const hasCompletedTask = tasks.some(
        (task) => task.completedAt && new Date(task.completedAt).toDateString() === dateStr,
      )

      if (hasCompletedTask) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const streak = getCompletionStreak()

  // Overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "Completed") return false
    return new Date(task.dueDate) < new Date()
  }).length

  // Weekly completion trend (simplified)
  const getWeeklyStats = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const thisWeekCompleted = tasks.filter((task) => task.completedAt && new Date(task.completedAt) >= weekAgo).length

    const thisWeekCreated = tasks.filter((task) => new Date(task.createdAt) >= weekAgo).length

    return { completed: thisWeekCompleted, created: thisWeekCreated }
  }

  const weeklyStats = getWeeklyStats()

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

  const getEffortLabel = (effort: number) => {
    const labels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    return labels[effort] || "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks
            </p>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak}</div>
            <p className="text-xs text-muted-foreground">{streak === 1 ? "day" : "days"} of completing tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.completed}</div>
            <p className="text-xs text-muted-foreground">completed, {weeklyStats.created} created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">tasks past due date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Category Breakdown
            </CardTitle>
            <CardDescription>Task distribution by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => {
              const completion = categoryCompletionStats[category]
              const completionRate = completion ? (completion.completed / completion.total) * 100 : 0

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {completion?.completed || 0}/{count} ({completionRate.toFixed(0)}%)
                    </div>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Priority Distribution
            </CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(priorityStats).map(([priority, count]) => {
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0

              return (
                <div key={priority} className="flex items-center justify-between">
                  <Badge className={priorityColors[priority as keyof typeof priorityColors]}>{priority}</Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{count}</span>
                    <span className="text-sm text-muted-foreground">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Effort Analysis</CardTitle>
            <CardDescription>Task complexity distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{averageEffort.toFixed(1)}</div>
              <p className="text-sm text-blue-700">Average Effort Level</p>
              <p className="text-xs text-muted-foreground mt-1">{getEffortLabel(Math.round(averageEffort))}</p>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((effort) => {
                const count = effortStats[effort] || 0
                const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0

                return (
                  <div key={effort} className="flex items-center justify-between">
                    <span className="text-sm">{getEffortLabel(effort)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
            <CardDescription>Key metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Most Productive Category</p>
                  <p className="text-sm text-green-600">
                    {
                      Object.entries(categoryCompletionStats).reduce(
                        (best, [cat, stats]) => {
                          const rate = stats.total > 0 ? stats.completed / stats.total : 0
                          const bestRate = best.stats.total > 0 ? best.stats.completed / best.stats.total : 0
                          return rate > bestRate ? { category: cat, stats } : best
                        },
                        { category: "None", stats: { total: 0, completed: 0 } },
                      ).category
                    }
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-800">Needs Attention</p>
                  <p className="text-sm text-orange-600">
                    {overdueTasks > 0 ? `${overdueTasks} overdue tasks` : "All tasks on track!"}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800 mb-2">Recommendations</p>
                <ul className="text-sm text-blue-600 space-y-1">
                  {completionRate < 50 && <li>• Focus on completing existing tasks before adding new ones</li>}
                  {overdueTasks > 0 && <li>• Prioritize overdue tasks to get back on track</li>}
                  {averageEffort > 4 && <li>• Consider breaking down complex tasks into smaller steps</li>}
                  {streak === 0 && <li>• Start a completion streak by finishing one task today</li>}
                  {streak > 0 && <li>• Great job on your {streak}-day streak! Keep it up!</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
