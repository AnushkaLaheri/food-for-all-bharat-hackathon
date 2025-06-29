import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Link from "next/link"

export default function ConsumerDashboard() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="consumer" />
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}
      >
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome Back Daniel</h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/consumer/request">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 w-full">Request Food</Button>
            </Link>
            <Link href="/consumer/available-foods">
              <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 w-full">View Available Food</Button>
            </Link>
          </div>
          <p className="text-white text-sm">Food For All Initiative</p>
        </div>
      </div>
    </main>
  )
}

