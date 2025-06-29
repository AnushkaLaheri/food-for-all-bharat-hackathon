"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Award, Gift, Info, Medal, Star, Trophy, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Trigger confetti when the page loads
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [])

  const topDonors = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      donations: 42,
      impact: 1240,
      level: "Gold",
      progress: 85,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      donations: 38,
      impact: 1120,
      level: "Gold",
      progress: 78,
    },
    {
      id: 3,
      name: "Jessica Williams",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
      donations: 35,
      impact: 980,
      level: "Silver",
      progress: 92,
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40&text=DK",
      donations: 29,
      impact: 870,
      level: "Silver",
      progress: 65,
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
      donations: 27,
      impact: 810,
      level: "Silver",
      progress: 54,
    },
    {
      id: 6,
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
      donations: 24,
      impact: 720,
      level: "Bronze",
      progress: 88,
    },
    {
      id: 7,
      name: "Sophia Garcia",
      avatar: "/placeholder.svg?height=40&width=40&text=SG",
      donations: 22,
      impact: 660,
      level: "Bronze",
      progress: 76,
    },
    {
      id: 8,
      name: "Daniel Martinez",
      avatar: "/placeholder.svg?height=40&width=40&text=DM",
      donations: 19,
      impact: 570,
      level: "Bronze",
      progress: 42,
    },
  ]

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "Gold":
        return "bg-amber-500 text-white"
      case "Silver":
        return "bg-slate-400 text-white"
      case "Bronze":
        return "bg-amber-700 text-white"
      default:
        return "bg-slate-200 text-slate-700"
    }
  }

  const getTopDonorIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-6 w-6 text-amber-500" />
      case 1:
        return <Medal className="h-6 w-6 text-slate-400" />
      case 2:
        return <Medal className="h-6 w-6 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">Celebrating our top food donors and their impact</p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5 space-y-6">
          <Tabs defaultValue="donors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="donors">Top Donors</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
            </TabsList>
            <TabsContent value="donors" className="space-y-4 pt-4">
              {/* Top 3 Donors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topDonors.slice(0, 3).map((donor, index) => (
                  <Card
                    key={donor.id}
                    className={cn(
                      "overflow-hidden animate-fade-in-up",
                      index === 0 && "border-amber-500 dark:border-amber-500/50 shadow-lg",
                    )}
                  >
                    <div
                      className={cn(
                        "h-2",
                        index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : "bg-amber-700",
                      )}
                    />
                    <CardHeader className="text-center pb-2">
                      <div className="flex justify-center mb-2">{getTopDonorIcon(index)}</div>
                      <div className="relative mx-auto">
                        <Avatar className="h-16 w-16 mx-auto">
                          <AvatarImage src={donor.avatar} alt={donor.name} />
                          <AvatarFallback>
                            {donor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute bottom-0 right-0 rounded-full p-1",
                            index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : "bg-amber-700",
                          )}
                        >
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <CardTitle className="mt-2">{donor.name}</CardTitle>
                      <CardDescription>
                        <Badge className={cn("mt-1", getBadgeColor(donor.level))}>{donor.level} Donor</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-2xl font-bold">{donor.donations}</p>
                          <p className="text-xs text-muted-foreground">Donations</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{donor.impact}</p>
                          <p className="text-xs text-muted-foreground">Impact Score</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Next Level</span>
                          <span>{donor.progress}%</span>
                        </div>
                        <Progress value={donor.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Other Donors */}
              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard Rankings</CardTitle>
                  <CardDescription>Based on number of donations and impact score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDonors.slice(3).map((donor, index) => (
                      <div
                        key={donor.id}
                        className="flex items-center justify-between p-2 rounded-lg border animate-fade-in-up"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                            {index + 4}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={donor.avatar} alt={donor.name} />
                            <AvatarFallback>
                              {donor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{donor.name}</p>
                            <Badge className={cn("text-xs", getBadgeColor(donor.level))}>{donor.level}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="font-bold">{donor.donations}</p>
                            <p className="text-xs text-muted-foreground">Donations</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">{donor.impact}</p>
                            <p className="text-xs text-muted-foreground">Impact</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communities" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Communities</CardTitle>
                  <CardDescription>Communities making the biggest impact</CardDescription>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="bg-muted p-3 rounded-full">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      We're working on community leaderboards to showcase neighborhoods and groups making a difference
                      together.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizations" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Organizations</CardTitle>
                  <CardDescription>Organizations leading the way in food sharing</CardDescription>
                </CardHeader>
                <CardContent className="py-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="bg-muted p-3 rounded-full">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Organization leaderboards will be available soon, highlighting businesses and nonprofits making an
                      impact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="animate-fade-in-up animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-emerald-500" />
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                    12
                  </div>
                  <div>
                    <p className="font-medium">Your Position</p>
                    <p className="text-xs text-muted-foreground">Top 15%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Your Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg border">
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-xs text-muted-foreground">Donations</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-2xl font-bold">540</p>
                    <p className="text-xs text-muted-foreground">Impact Score</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Next Badge: Silver</h3>
                  <span className="text-xs text-muted-foreground">72%</span>
                </div>
                <Progress value={72} className="h-2" />
                <p className="text-xs text-muted-foreground">5 more donations to reach Silver status</p>
              </div>

              <Button className="w-full" asChild>
                <a href="/donate">
                  <Gift className="mr-2 h-4 w-4" />
                  Donate to Improve Rank
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-emerald-500" />
                How Rankings Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Impact Score</h3>
                <p className="text-sm text-muted-foreground">
                  Your impact score is calculated based on the quantity, quality, and frequency of your donations.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Donor Levels</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-amber-500 text-white">Gold</Badge>
                    <span className="text-sm text-muted-foreground">30+ donations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-slate-400 text-white">Silver</Badge>
                    <span className="text-sm text-muted-foreground">20-29 donations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-amber-700 text-white">Bronze</Badge>
                    <span className="text-sm text-muted-foreground">10-19 donations</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Leaderboard Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Rankings are updated daily. Special badges and achievements are awarded monthly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

