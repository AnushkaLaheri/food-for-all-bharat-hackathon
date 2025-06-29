import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"

export default function DonateForm() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="donor" />
      <div
        className="flex-1 flex items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6">Donate Cooked Food</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="foodType">Food Type</Label>
              <Input id="foodType" placeholder="Enter food type" />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" placeholder="Enter quantity" />
            </div>
            <div>
              <Label htmlFor="cookingTime">Cooking Time</Label>
              <Input id="cookingTime" type="time" />
            </div>
            <div>
              <Label htmlFor="bestBefore">Best Before</Label>
              <Input id="bestBefore" type="time" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter pickup address" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter food description" />
            </div>
            <div>
              <Label htmlFor="image">Upload Image</Label>
              <Input id="image" type="file" />
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

