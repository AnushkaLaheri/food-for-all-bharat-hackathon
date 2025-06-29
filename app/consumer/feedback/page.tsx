import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"

export default function FeedbackForm() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="consumer" />
      <div
        className="flex-1 flex items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6">Feedback Form</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter your phone number" />
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea id="feedback" placeholder="Please share your feedback" rows={5} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="consent" className="rounded" />
              <Label htmlFor="consent">I allow my feedback to be shared</Label>
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

