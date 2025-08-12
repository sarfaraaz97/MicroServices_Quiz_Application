"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { questionApi } from "@/lib/api"

export default function CreateQuestionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    question_title: "",
    category: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    right_answer: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Validate form
    if (!formData.question_title.trim()) {
      alert("Please enter a question")
      setSubmitting(false)
      return
    }

    if (!formData.option1 || !formData.option2 || !formData.option3 || !formData.option4) {
      alert("Please fill in all four options")
      setSubmitting(false)
      return
    }

    if (!formData.right_answer) {
      alert("Please select the correct answer")
      setSubmitting(false)
      return
    }

    if (!formData.category) {
      alert("Please select a category")
      setSubmitting(false)
      return
    }

    try {
      await questionApi.addQuestion(formData)
      alert("Question created successfully!")
      router.push("/admin/questions")
    } catch (error) {
      console.error("Failed to create question:", error)
      alert("Failed to create question. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Question</h1>
            <p className="text-gray-600">Add a new question to your question bank</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={formData.question_title}
                    onChange={(e) => handleInputChange("question_title", e.target.value)}
                    placeholder="Enter your question"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Framework">Framework</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Answer Options</Label>

                  <div className="space-y-3">
                    <RadioGroup
                      value={formData.right_answer}
                      onValueChange={(value) => handleInputChange("right_answer", value)}
                    >
                      {[
                        { key: "option1", label: "Option 1" },
                        { key: "option2", label: "Option 2" },
                        { key: "option3", label: "Option 3" },
                        { key: "option4", label: "Option 4" },
                      ].map((option) => (
                        <div key={option.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem
                            value={formData[option.key as keyof typeof formData]}
                            id={option.key}
                            disabled={!formData[option.key as keyof typeof formData]}
                          />
                          <Input
                            value={formData[option.key as keyof typeof formData]}
                            onChange={(e) => handleInputChange(option.key, e.target.value)}
                            placeholder={option.label}
                            className="flex-1"
                            required
                          />
                          <Label htmlFor={option.key} className="text-sm text-gray-500 min-w-fit">
                            Correct?
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Question"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
