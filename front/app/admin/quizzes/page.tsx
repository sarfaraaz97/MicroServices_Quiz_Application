"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

interface Quiz {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  questionCount: number
  status: string
  createdAt: string
}

export default function AdminQuizzesPage() {
  // Only show the Create Quiz button/tab

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // No loading state or quiz list

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-40">
      <Link href="/admin/quizzes/create">
        <Button size="lg" className="text-2xl px-10 py-6">
          <Plus className="w-8 h-8 mr-3" />
          Create Quiz
        </Button>
      </Link>
    </div>
  )
}
