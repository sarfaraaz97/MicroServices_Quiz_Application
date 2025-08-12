"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { questionApi, type Question } from "@/lib/api"

interface QuestionDisplay extends Question {
  difficulty: string
  type: string
  createdAt: string
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDisplay[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionDisplay[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const apiQuestions = await questionApi.getAllQuestions()

        // Transform API questions to display format
        const displayQuestions: QuestionDisplay[] = apiQuestions.map((q) => ({
          ...q,
          difficulty: "Intermediate", // Mock difficulty since not in API
          type: "Multiple Choice",
          createdAt: new Date().toISOString().split("T")[0], // Mock creation date
        }))

        setQuestions(displayQuestions)
        setFilteredQuestions(displayQuestions)
      } catch (error) {
        console.error("Failed to load questions:", error)
        setQuestions([])
        setFilteredQuestions([])
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  useEffect(() => {
    const filtered = questions.filter(
      (question) =>
        question.question_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredQuestions(filtered)
  }, [searchTerm, questions])

  const handleDeleteQuestion = async (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updated = questions.filter((question) => question.id !== id)
      setQuestions(updated)
      setFilteredQuestions(updated)
      console.log("Question deleted from UI (API delete not implemented)")
    }
  }

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
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Questions</h1>
            <p className="text-gray-600">Create and manage your question bank</p>
          </div>
          <Link href="/admin/questions/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{question.question_title}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{question.category}</Badge>
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                      <Badge variant="outline">{question.type}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/questions/edit/${question.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Options:</p>
                  <div className="grid gap-1">
                    {[question.option1, question.option2, question.option3, question.option4].map((option, index) => (
                      <div
                        key={index}
                        className={`text-sm p-2 rounded ${
                          option === question.right_answer
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {option === question.right_answer && "✓ "}
                        {option}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Created: {question.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
