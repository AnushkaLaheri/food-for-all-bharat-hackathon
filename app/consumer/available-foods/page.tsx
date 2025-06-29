import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/header"

export default function AvailableFoods() {
  const foods = [
    {
      id: "1",
      foodType: "Rice",
      foodItem: "Fried Rice",
      quantity: "5 Plates",
      cookingTime: "12:30 PM",
      bestBefore: "4:30 PM",
      location: "123 Main St",
      date: "Aug 20, 2023",
    },
    {
      id: "2",
      foodType: "Bread",
      foodItem: "Sandwich",
      quantity: "10 Pieces",
      cookingTime: "11:00 AM",
      bestBefore: "3:00 PM",
      location: "456 Oak St",
      date: "Aug 20, 2023",
    },
    {
      id: "3",
      foodType: "Curry",
      foodItem: "Chicken Curry",
      quantity: "8 Plates",
      cookingTime: "1:00 PM",
      bestBefore: "5:00 PM",
      location: "789 Pine St",
      date: "Aug 20, 2023",
    },
    {
      id: "4",
      foodType: "Pasta",
      foodItem: "Spaghetti",
      quantity: "6 Plates",
      cookingTime: "12:00 PM",
      bestBefore: "4:00 PM",
      location: "101 Elm St",
      date: "Aug 20, 2023",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="consumer" />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Today&apos;s Available Cooked Meals</h1>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Type</TableHead>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Time of Cooking</TableHead>
                  <TableHead>Best Before</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date of Donation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foods.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell>{food.foodType}</TableCell>
                    <TableCell>{food.foodItem}</TableCell>
                    <TableCell>{food.quantity}</TableCell>
                    <TableCell>{food.cookingTime}</TableCell>
                    <TableCell>{food.bestBefore}</TableCell>
                    <TableCell>{food.location}</TableCell>
                    <TableCell>{food.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  )
}

