import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Image from "next/image"

export default function FeedbackPage() {
  const feedbacks = [
    {
      id: "1",
      name: "John Doe",
      image: "/placeholder.svg?height=200&width=200",
      comment: "The food was delicious and fresh. Thank you for your support!",
      date: "August 20, 2023",
    },
    {
      id: "2",
      name: "Jane Smith",
      image: "/placeholder.svg?height=200&width=200",
      comment: "I'm grateful for the regular meals. It has helped my family tremendously.",
      date: "August 15, 2023",
    },
    {
      id: "3",
      name: "Robert Johnson",
      image: "/placeholder.svg?height=200&width=200",
      comment: "The volunteers are so kind and the food quality is excellent.",
      date: "August 10, 2023",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Feedback From Consumers</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={feedback.image || "/placeholder.svg"}
                    alt={`Feedback from ${feedback.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold">{feedback.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{feedback.date}</p>
                  <p className="text-sm">{feedback.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

