import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/header"

export default function PendingRequests() {
  const requests = [
    {
      id: "1",
      foodType: "Rice",
      quantity: "5 kg",
      donor: "John Doe",
      address: "123 Main St, City",
      date: "Aug 20, 2023",
    },
    {
      id: "2",
      foodType: "Bread",
      quantity: "10 pcs",
      donor: "Jane Smith",
      address: "456 Oak St, City",
      date: "Aug 21, 2023",
    },
    {
      id: "3",
      foodType: "Curry",
      quantity: "2 kg",
      donor: "Robert Johnson",
      address: "789 Pine St, City",
      date: "Aug 22, 2023",
    },
    {
      id: "4",
      foodType: "Pasta",
      quantity: "3 kg",
      donor: "Emily Davis",
      address: "101 Elm St, City",
      date: "Aug 23, 2023",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="ngo" />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pending Requests</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Donor Address</TableHead>
                  <TableHead>Date of Donation</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.foodType}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.address}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Accept
                        </Button>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                          Reject
                        </Button>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Completed
                        </Button>
                      </div>
                    </TableCell>
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

