import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const stats = [
    { title: "Total Donors", value: "124" },
    { title: "Total NGOs", value: "15" },
    { title: "Total Consumers", value: "450" },
    { title: "Total Donations", value: "789" },
  ]

  const recentDonations = [
    { id: "1", donor: "John Doe", food: "Rice", quantity: "5kg", date: "Aug 20, 2023" },
    { id: "2", donor: "Jane Smith", food: "Bread", quantity: "10pcs", date: "Aug 21, 2023" },
    { id: "3", donor: "Robert Johnson", food: "Curry", quantity: "2kg", date: "Aug 22, 2023" },
  ]

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Food</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.donor}</TableCell>
                        <TableCell>{donation.food}</TableCell>
                        <TableCell>{donation.quantity}</TableCell>
                        <TableCell>{donation.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">Manage Users</Button>
                <Button className="w-full">View Reports</Button>
                <Button className="w-full">System Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

