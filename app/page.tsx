import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Utensils, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
          style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-700/20 dark:from-green-900/30 dark:to-emerald-950/30" />

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <Badge className="mb-2 animate-fade-in" variant="outline">
              Join Our Mission
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter animate-fade-in-up">
              Share Food, <span className="text-emerald-600 dark:text-emerald-400">Share Love</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[700px] animate-fade-in-up animation-delay-100">
              Connect with your community by sharing surplus food with those who need it most. Every donation makes a
              difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up animation-delay-200">
              <Link href="/donate">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Donate Food <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline">
                  Explore Available Food
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-2 p-6 bg-background rounded-lg shadow-sm border animate-fade-in-up">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold">12,450+</h3>
              <p className="text-muted-foreground">Meals Donated</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-6 bg-background rounded-lg shadow-sm border animate-fade-in-up animation-delay-100">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold">5,280+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-6 bg-background rounded-lg shadow-sm border animate-fade-in-up animation-delay-200">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold">320+</h3>
              <p className="text-muted-foreground">Communities Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-[700px]">
              Our platform makes food donation simple, efficient, and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-background shadow-sm animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Register & Connect</h3>
              <p className="text-muted-foreground">Create your account and join our community of food sharers.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-background shadow-sm animate-fade-in-up animation-delay-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">List Your Donation</h3>
              <p className="text-muted-foreground">Share details about your surplus food and when it's available.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-background shadow-sm animate-fade-in-up animation-delay-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Make a Difference</h3>
              <p className="text-muted-foreground">Coordinate pickup or delivery and track your impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Donations */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Featured Donations</h2>
            <p className="text-muted-foreground text-lg max-w-[700px]">
              Check out some of the recent food donations from our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {[
    {
      id: 1,
      image: "/pasta.jpg",
      title: "Homemade Pasta",
      description: "Freshly made pasta with tomato sauce. Enough for 4-6 people.",
      distance: "2 miles away"
    },
    {
      id: 2,
      image: "/Chicken.jpg",
      title: "Chicken",
      description: "Fresh organic chicken with seasonal vegetables. Serves 2-3.",
      distance: "1 mile away"
    },
    {
      id: 3,
      image: "/sandwich.jpg",
      title: "Club Sandwich",
      description: "Triple-decker sandwich with turkey and bacon. 2 servings.",
      distance: "3 miles away"
    }
  ].map((food) => (
    <div
      key={food.id}
      className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md animate-fade-in-up"
    >
      <div className="aspect-video w-full overflow-hidden">
        <Image
          src={food.image}
          alt={food.title}
          width={500}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <Badge className="mb-2" variant="outline">
          Fresh
        </Badge>
        <h3 className="text-xl font-bold mb-2">{food.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {food.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{food.distance}</span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Available Now
          </span>
        </div>
      </div>
    </div>
  ))}
</div>

          <div className="flex justify-center mt-8">
            <Link href="/explore">
              <Button variant="outline">
                View All Donations <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
          style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-500/20 dark:from-emerald-900/30 dark:to-green-950/30" />

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground text-lg max-w-[700px]">
              Join thousands of others who are reducing food waste and helping their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Join Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

