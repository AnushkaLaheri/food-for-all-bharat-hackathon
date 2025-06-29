"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Award, Calendar, Clock, Gift, TrendingUp, Utensils } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // User Token
      },
    })
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your food sharing activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">867</div>
            <p className="text-xs text-muted-foreground">+120 points this week</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Meals Shared</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">Approximately 86 meals provided</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up animation-delay-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Badge</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Silver</div>
            <div className="mt-2">
              <Progress value={68} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">68% complete - 8 more donations needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Donations</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Donations</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 pt-4">
              <Card>
              <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
  <div>
    <CardTitle>Your Active Donations</CardTitle>
    <CardDescription>Food items you've listed that are currently available</CardDescription>
  </div>
  <Button size="sm">Add New Donation</Button>
</div>
</CardHeader>
<CardContent className="space-y-4">
  {[
    {
      id: 1,
      name: "Homemade Lasagna",
      description: "Family-sized portion, freshly made yesterday",
      expires: "2 days",
      status: "Active",
      image: "lasanga.jpg" // Added image path
    },
    {
      id: 2, 
      name: "Fresh Vegetable Platter",
      description: "Assorted seasonal vegetables from local farm",
      expires: "1 day",
      status: "Active",
      image: "/veg platter.jpg" // Added image path
    }
  ].map((donation) => (
    <div key={donation.id} className="flex items-start space-x-4 rounded-lg border p-3">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        <Image
          src={donation.image}
          alt={donation.name}
          width={64}
          height={64}
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{donation.name}</h4>
          <Badge variant="outline" className="text-xs">
            {donation.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{donation.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>Expires in {donation.expires}</span>
        </div>
      </div>
    </div>
  ))}
</CardContent>
<CardFooter>
  <Button variant="ghost" size="sm" className="w-full" asChild>
    <Link href="/donate">Add New Donation</Link>
  </Button>
</CardFooter>
</Card>
            </TabsContent>
            <TabsContent value="upcoming" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Donations</CardTitle>
                  <CardDescription>Donations you've scheduled for the future</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>No upcoming donations scheduled</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/donate">Schedule a Donation</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="past" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Donations</CardTitle>
                  <CardDescription>Your donation history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4 rounded-lg border p-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
                        <Image
                          src={`/placeholder.svg?height=64&width=64&text=Past+${i}`}
                          alt={`Past donation ${i}`}
                          fill
                          className="object-cover opacity-70"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold">Vegetable Soup</h4>
                        <p className="text-sm text-muted-foreground">4 servings, homemade with fresh ingredients</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>Donated on May 1{i}, 2023</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="col-span-3 space-y-4">
          <Card className="animate-fade-in-up animation-delay-200">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
              <CardDescription>See the difference you're making</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Food Waste Reduced</span>
                  <span className="text-sm font-medium">24 kg</span>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-muted-foreground">You've helped reduce food waste by 24 kg this year</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">People Helped</span>
                  <span className="text-sm font-medium">86</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">Your donations have helped approximately 86 people</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CO₂ Emissions Saved</span>
                  <span className="text-sm font-medium">48 kg</span>
                </div>
                <Progress value={48} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  By reducing food waste, you've prevented 48 kg of CO₂ emissions
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/impact">
                  View Detailed Impact <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardHeader>
              <CardTitle>Nearby Food Available</CardTitle>
              <CardDescription>Food donations in your area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
  {[
    {
      id: 1,
      title: "Fresh Bread & Pastries",
      description: "Assorted bread and pastries from local bakery",
      image: "/roti.jpg", // Replace with your actual image path
      distance: "1.2 miles away",
      status: "Available now"
    },
    {
      id: 2,
      title: "Organic Vegetables",
      description: "Fresh seasonal vegetables from local farm",
      image: "/veg platter.jpg", // Replace with your actual image path
      distance: "0.8 miles away",
      status: "Available now"
    }
  ].map((item) => (
    <div key={item.id} className="flex items-start space-x-4 rounded-lg border p-3">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          // Optional: Add placeholder while images load
          placeholder="blur"
          blurDataURL="/placeholder.svg"
        />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold">{item.title}</h4>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{item.distance} • {item.status}</span>
        </div>
      </div>
    </div>
  ))}
</CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/explore">View All Nearby Food</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

