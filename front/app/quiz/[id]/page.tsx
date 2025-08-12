"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { quizApi, questionApi, type Response, getCategories } from "@/lib/api"

interface Question {
  id: number
  question_title: string
  option1: string
  option2: string
  option3: string
  option4: string
}

interface QuizData {
  id: number
  title: string
  questions: Question[]
  timeLimit: number
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizId = Number.parseInt(params.id)

        try {
          const questions = await quizApi.getQuizQuestions(quizId)
          setQuiz({
            id: quizId,
            title: `Quiz ${quizId}`,
            questions: questions,
            timeLimit: 15,
          })
        } catch (error) {
          const categories = await getCategories()
          const selectedCategory = categories[quizId - 1] || categories[0]

          if (selectedCategory) {
            const questionIds = await questionApi.generateQuestionIds(selectedCategory, 10)
            const questions = await questionApi.getQuestionsByIds(questionIds)

            setQuiz({
              id: quizId,
              title: `${selectedCategory} Quiz`,
              questions: questions,
              timeLimit: 15,
            })
          } else {
            throw new Error("No categories available")
          }
        }

        setTimeLeft(15 * 60)
      } catch (error) {
        console.error("Failed to load quiz:", error)
        setQuiz(null)
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [params.id])

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizCompleted])

  const handleAnswerChange = (questionId: number, answerValue: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerValue }))
  }

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz) return

    try {
      const responses: Response[] = Object.entries(answers).map(([questionId, response]) => ({
        id: Number.parseInt(questionId),
        response: response,
      }))

      const calculatedScore = await questionApi.getScore(responses)
      setScore(calculatedScore)
      setQuizCompleted(true)
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      setQuizCompleted(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    if (score !== null) return Math.round((score / (quiz?.questions.length || 1)) * 100)
    return 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Quiz not found</p>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    const finalScore = calculateScore()
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-3xl font-bold text-blue-600">{finalScore}%</p>
              <p className="text-gray-600">Your Score</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                Correct: {score || 0} / {quiz?.questions.length || 0}
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => router.push("/quizzes")} className="w-full">
                Back to Quizzes
              </Button>
              <Button variant="outline" onClick={() => router.push("/results")} className="w-full">
                View Detailed Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question_title}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
            >
              {[currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="space-x-2">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
