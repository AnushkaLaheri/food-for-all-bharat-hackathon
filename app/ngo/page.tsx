import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Link from "next/link"
import { CircleIcon } from "lucide-react"

export default function NGODashboard() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="ngo" />
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}
      >
        <h1 className="text-3xl font-bold text-red-500 mb-8">Welcome Back ngo</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <Card className="bg-transparent border-red-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CircleIcon className="h-8 w-8 text-red-500 mr-2" />
                <span>01</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">See Food Donation Requests</h3>
              <p className="text-sm">View all pending donation requests</p>
            </CardContent>
            <CardFooter>
              <Link href="/ngo/pending-requests">
                <Button variant="outline" className="border-red-500 text-white hover:bg-red-500">
                  View Requests
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-transparent border-red-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CircleIcon className="h-8 w-8 text-red-500 mr-2" />
                <span>02</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Track Food Distribution</h3>
              <p className="text-sm">Monitor food distribution to consumers</p>
            </CardContent>
            <CardFooter>
              <Link href="/ngo/distribution">
                <Button variant="outline" className="border-red-500 text-white hover:bg-red-500">
                  Track Distribution
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-transparent border-red-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CircleIcon className="h-8 w-8 text-red-500 mr-2" />
                <span>03</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Manage Food Inventory</h3>
              <p className="text-sm">Check and update available food inventory</p>
            </CardContent>
            <CardFooter>
              <Link href="/ngo/inventory">
                <Button variant="outline" className="border-red-500 text-white hover:bg-red-500">
                  Manage Inventory
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

