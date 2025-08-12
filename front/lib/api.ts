const QUESTION_SERVICE_URL = process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL
  ? `${process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL}/Question`
  : "http://localhost:8080/Question"
const QUIZ_SERVICE_URL = process.env.NEXT_PUBLIC_QUIZ_SERVICE_URL
  ? `${process.env.NEXT_PUBLIC_QUIZ_SERVICE_URL}/quiz`
  : "http://localhost:8090/quiz"

// Types based on Java backend models
export interface Question {
  id: number
  question_title: string
  option1: string
  option2: string
  option3: string
  option4: string
  right_answer: string
  category: string
}

export interface QuestionWrapper {
  id: number
  question_title: string
  option1: string
  option2: string
  option3: string
  option4: string
}

export interface Response {
  id: number
  response: string
}

export interface QuizDto {
  category: string
  noOfquestions: number
  title: string
}

// Question Service API calls
export const questionApi = {
  // GET /Question/allQuestions
  getAllQuestions: async (): Promise<Question[]> => {
    const response = await fetch(`${QUESTION_SERVICE_URL}/allQuestions`)
    if (!response.ok) throw new Error("Failed to fetch questions")
    return response.json()
  },

  // GET /Question/category/{category}
  getQuestionsByCategory: async (category: string): Promise<Question[]> => {
    const response = await fetch(`${QUESTION_SERVICE_URL}/category/${category}`)
    if (!response.ok) throw new Error("Failed to fetch questions by category")
    return response.json()
  },

  // POST /Question/addQuestion
  addQuestion: async (question: Omit<Question, "id">): Promise<string> => {
    const response = await fetch(`${QUESTION_SERVICE_URL}/addQuestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    })
    if (!response.ok) throw new Error("Failed to add question")
    return response.text()
  },

  // GET /Question/generate?categoryname=X&numofquestions=Y
  generateQuestionIds: async (categoryname: string, numofquestions: number): Promise<number[]> => {
    const response = await fetch(
      `${QUESTION_SERVICE_URL}/generate?categoryname=${categoryname}&numofquestions=${numofquestions}`,
    )
    if (!response.ok) throw new Error("Failed to generate question IDs")
    return response.json()
  },

  // POST /Question/getQuestions
  getQuestionsByIds: async (ids: number[]): Promise<QuestionWrapper[]> => {
    const response = await fetch(`${QUESTION_SERVICE_URL}/getQuestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    })
    if (!response.ok) throw new Error("Failed to fetch questions by IDs")
    return response.json()
  },

  // POST /Question/getscore
  getScore: async (responses: Response[]): Promise<number> => {
    const response = await fetch(`${QUESTION_SERVICE_URL}/getscore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responses),
    })
    if (!response.ok) throw new Error("Failed to calculate score")
    return response.json()
  },
}

// Quiz Service API calls
export const quizApi = {
  // POST /quiz/create
  createQuiz: async (quizDto: QuizDto): Promise<string> => {
    const response = await fetch(`${QUIZ_SERVICE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quizDto),
    })
    if (!response.ok) throw new Error("Failed to create quiz")
    return response.text()
  },

  // GET /quiz/get/{id}
  getQuizQuestions: async (id: number): Promise<QuestionWrapper[]> => {
    const response = await fetch(`${QUIZ_SERVICE_URL}/get/${id}`)
    if (!response.ok) throw new Error("Failed to fetch quiz questions")
    return response.json()
  },

  // POST /quiz/submit/{id}
  submitQuiz: async (id: number, responses: Response[]): Promise<number> => {
    const response = await fetch(`${QUIZ_SERVICE_URL}/submit/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responses),
    })
    if (!response.ok) throw new Error("Failed to submit quiz")
    return response.json()
  },
}

// Helper function to get unique categories
export const getCategories = async (): Promise<string[]> => {
  const questions = await questionApi.getAllQuestions()
  const categories = [...new Set(questions.map((q) => q.category))]
  return categories
}
