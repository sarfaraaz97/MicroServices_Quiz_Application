"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { questionApi, getCategories } from "@/lib/api"

interface Quiz {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  questionCount: number
  timeLimit: number
  attempts: number
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        // Get all questions to create quiz previews
        const questions = await questionApi.getAllQuestions()
        const categories = await getCategories()

        // Create quiz previews based on available categories
        const quizPreviews: Quiz[] = categories.map((category, index) => {
          const categoryQuestions = questions.filter((q) => q.category === category)
          return {
            id: index + 1,
            title: `${category} Quiz`,
            description: `Test your knowledge of ${category}`,
            category: category,
            difficulty:
              categoryQuestions.length > 15 ? "Advanced" : categoryQuestions.length > 8 ? "Intermediate" : "Beginner",
            questionCount: Math.min(categoryQuestions.length, 10),
            timeLimit: 15,
            attempts: Math.floor(Math.random() * 300) + 50, // Mock attempt count
          }
        })

        setQuizzes(quizPreviews)
      } catch (error) {
        console.error("Failed to load quizzes:", error)
        // Fallback to empty array on error
        setQuizzes([])
      } finally {
        setLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Quizzes</h1>
          <p className="text-gray-600">Choose a quiz to test your knowledge</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                </div>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quiz.timeLimit} min
                    </span>
                    <span>{quiz.questionCount} questions</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{quiz.attempts} attempts</span>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {quiz.category}
                  </Badge>

                  <Link href={`/quiz/${quiz.id}`} className="block">
                    <Button className="w-full mt-4">
                      Start Quiz
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
