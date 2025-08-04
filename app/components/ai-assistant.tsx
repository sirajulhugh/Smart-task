"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Sparkles, Target, ListChecks, Lightbulb, Loader2, Plus } from "lucide-react"
import type { Task, Subtask } from "../page"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface AIAssistantProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void
}

export function AIAssistant({ tasks, onUpdateTask, onAddTask }: AIAssistantProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [activeFeature, setActiveFeature] = useState("enhance")

  const handleEnhanceTask = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `As a task management AI assistant, enhance this vague task: "${input}"

Please provide:
1. A clarified, actionable version of the task
2. Suggested breakdown into specific steps
3. Recommended category (Work, Personal, Health, Study, Communication, Errands)
4. Priority level (Low, Medium, High, Critical) with reasoning
5. Estimated effort level (1-5 scale)
6. Optimal timing suggestions

Format your response clearly with sections.`

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      setResponse(text)
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setResponse("Sorry, I encountered an error while processing your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeTask = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `Analyze this task for smart categorization and scheduling: "${input}"

Please provide:
1. Category classification (Work, Personal, Health, Study, Communication, Errands) with reasoning
2. Urgency assessment (Low, Medium, High, Critical) based on context clues
3. Optimal timing recommendations (morning, afternoon, evening) based on task type
4. Energy level requirements and focus needed
5. Dependencies or prerequisites
6. Potential obstacles and how to overcome them

Be specific and actionable in your analysis.`

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      setResponse(text)
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setResponse("Sorry, I encountered an error while analyzing your task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSubtasks = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `Break down this complex task into specific, actionable subtasks: "${input}"

Please provide:
1. A numbered list of 4-8 specific subtasks
2. Each subtask should be clear and actionable
3. Order them logically (what needs to be done first, second, etc.)
4. Include time estimates for each subtask if possible
5. Note any dependencies between subtasks

Make sure each subtask is something that can be completed in one focused session.`

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      setResponse(text)
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setResponse("Sorry, I encountered an error while generating subtasks. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetHelp = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `Provide comprehensive help and guidance for this task: "${input}"

Please include:
1. Step-by-step approach or methodology
2. Best practices and tips
3. Common pitfalls to avoid
4. Resources or tools that might be helpful
5. Templates or examples if applicable
6. Quality checkpoints to ensure good results

Be practical and actionable in your advice.`

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      setResponse(text)
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setResponse("Sorry, I encountered an error while generating help. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const createTaskFromResponse = () => {
    if (!input.trim()) return

    const subtasks: Subtask[] = []

    // Extract subtasks from response if they exist
    const lines = response.split("\n")
    lines.forEach((line) => {
      const match = line.match(/^\d+\.\s+(.+)$/)
      if (match) {
        subtasks.push({
          id: Date.now().toString() + Math.random(),
          title: match[1],
          completed: false,
        })
      }
    })

    const newTask: Omit<Task, "id" | "createdAt"> = {
      title: input,
      description: "AI-enhanced task with suggested improvements",
      category: input.toLowerCase().includes("work") ? "Work" : "Personal",
      priority: input.toLowerCase().includes("urgent") ? "High" : "Medium",
      urgency: input.toLowerCase().includes("urgent") ? "High" : "Medium",
      effort: 3,
      status: "Todo",
      subtasks,
      aiEnhanced: true,
      originalTitle: input,
    }

    onAddTask(newTask)
    setInput("")
    setResponse("")
  }

  const [dailyInsights, setDailyInsights] = useState<string>("")
  const [loadingInsights, setLoadingInsights] = useState(false)

  const loadDailyInsights = async () => {
    setLoadingInsights(true)
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const taskSummary = `
Current tasks summary:
- Total tasks: ${tasks.length}
- Completed: ${tasks.filter((t) => t.status === "Completed").length}
- High priority pending: ${tasks.filter((t) => (t.priority === "High" || t.priority === "Critical") && t.status !== "Completed").length}
- Due today: ${tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== "Completed").length}

Recent tasks: ${tasks
        .slice(0, 5)
        .map((t) => `${t.title} (${t.category}, ${t.priority})`)
        .join(", ")}
`

      const prompt = `Based on this task summary, provide daily planning insights and recommendations:

${taskSummary}

Please provide:
1. Today's focus priorities
2. Workload assessment
3. Specific recommendations for task ordering
4. Energy management tips
5. Productivity suggestions
6. Motivational insights

Keep it concise but actionable.`

      const result = await model.generateContent(prompt)
      const response = result.response
      setDailyInsights(response.text())
    } catch (error) {
      console.error("Error getting daily insights:", error)
      setDailyInsights(`Daily Planning Insights:

**Today's Focus:**
- You have ${tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== "Completed").length} tasks due today
- ${tasks.filter((t) => (t.priority === "High" || t.priority === "Critical") && t.status !== "Completed").length} high-priority tasks need attention

**Recommendations:**
- Start with high-priority tasks during peak energy hours
- Break large tasks into smaller, manageable chunks
- Schedule regular breaks to maintain focus
- Review completed tasks to stay motivated`)
    } finally {
      setLoadingInsights(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Task Assistant
          </CardTitle>
          <CardDescription>Get intelligent help with task management, planning, and productivity</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeFeature} onValueChange={setActiveFeature}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="enhance" className="text-xs">
            <Sparkles className="w-4 h-4 mr-1" />
            Enhance
          </TabsTrigger>
          <TabsTrigger value="analyze" className="text-xs">
            <Target className="w-4 h-4 mr-1" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="subtasks" className="text-xs">
            <ListChecks className="w-4 h-4 mr-1" />
            Subtasks
          </TabsTrigger>
          <TabsTrigger value="help" className="text-xs">
            <Lightbulb className="w-4 h-4 mr-1" />
            Help
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">
            <Brain className="w-4 h-4 mr-1" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Clarity Enhancer</CardTitle>
              <CardDescription>Transform vague tasks into clear, actionable items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter a vague task like 'Fix website bugs' or 'Study for exam'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
              <Button onClick={handleEnhanceTask} disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Enhance Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Analyzer</CardTitle>
              <CardDescription>Get smart categorization and scheduling suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your task to get category, urgency, and timing suggestions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAnalyzeTask} disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
                Analyze Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subtasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subtask Generator</CardTitle>
              <CardDescription>Break down complex tasks into manageable steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter a complex task like 'Prepare for English exam' or 'Launch new product'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
              <Button onClick={handleGenerateSubtasks} disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ListChecks className="w-4 h-4 mr-2" />
                )}
                Generate Subtasks
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Solving Assistant</CardTitle>
              <CardDescription>Get guidance, tips, and solutions for your tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ask for help with tasks like 'Write a cover letter' or 'Create a presentation'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
              <Button onClick={handleGetHelp} disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                Get Help
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Insights</CardTitle>
              <CardDescription>AI-powered planning advice based on your tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={loadDailyInsights} disabled={loadingInsights}>
                {loadingInsights ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Generate Daily Insights
              </Button>
              {dailyInsights && (
                <div className="whitespace-pre-line text-sm bg-gray-50 p-4 rounded-lg">{dailyInsights}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Response</CardTitle>
            <CardDescription>Here's what I found for your request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="whitespace-pre-line text-sm bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              {response}
            </div>
            {(activeFeature === "enhance" || activeFeature === "subtasks") && (
              <Button onClick={createTaskFromResponse} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Task from Response
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
