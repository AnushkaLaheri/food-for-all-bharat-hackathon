import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/header"

export default function DonorRequests() {
  const requests = [
    {
      id: "1",
      foodType: "Rice",
      quantity: "5 kg",
      status: "Pending",
      date: "Aug 20, 2023",
    },
    {
      id: "2",
      foodType: "Bread",
      quantity: "10 pcs",
      status: "Accepted",
      date: "Aug 21, 2023",
    },
    {
      id: "3",
      foodType: "Curry",
      quantity: "2 kg",
      status: "Completed",
      date: "Aug 22, 2023",
    },
    {
      id: "4",
      foodType: "Pasta",
      quantity: "3 kg",
      status: "Pending",
      date: "Aug 23, 2023",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="donor" />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Request Status</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date of Donation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.foodType}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{request.date}</TableCell>
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

