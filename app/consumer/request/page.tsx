import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"

export default function RequestFood() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header userType="consumer" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Select Food Package</h1>
          <p className="mb-6 text-gray-600">
            Packages are made based on quantity required for one person.Please select number of persons given below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle>Package 1</CardTitle>
                <p className="text-sm text-gray-500">This pack contains:</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Rice, Water, Chicken and Gravy Mix</p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 w-full">Select Package</Button>
                <span className="text-sm">Select</span>
              </CardFooter>
            </Card>

            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle>Package 2</CardTitle>
                <p className="text-sm text-gray-500">This pack contains:</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Bread, Cheese, Peanut Butter</p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 w-full">Select Package</Button>
                <span className="text-sm">Select</span>
              </CardFooter>
            </Card>

            <Card className="border shadow-md">
              <CardHeader>
                <CardTitle>Pack 3</CardTitle>
                <p className="text-sm text-gray-500">This pack contains:</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Pasta, Rice, Beef and Gravy Mix</p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 w-full">Select Package</Button>
                <span className="text-sm">Select</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

