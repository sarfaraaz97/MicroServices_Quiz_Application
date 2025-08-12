import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, BarChart3, Plus } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Management System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, manage, and take quizzes with our comprehensive microservices-powered platform
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="flex justify-center items-center mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Link href="/quizzes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
              <CardHeader className="text-center">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Take Quiz</CardTitle>
                <CardDescription>Browse and take available quizzes</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/quizzes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
              <CardHeader className="text-center">
                <Plus className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Create Quiz</CardTitle>
                <CardDescription>Create and manage your quizzes</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/questions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Manage Questions</CardTitle>
                <CardDescription>Add and edit quiz questions</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          </div>
        </div>
        </div>

      </div>
  )
}
