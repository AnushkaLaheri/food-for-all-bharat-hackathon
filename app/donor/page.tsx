import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Link from "next/link"

export default function DonorDashboard() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="donor" />
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}
      >
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-6">YOUR SUPPORT MATTERS</h1>
          <p className="text-white text-lg mb-8">We have worked smart and now given to people in need daily</p>
          <Link href="/donor/donate">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2">DONATE NOW</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

