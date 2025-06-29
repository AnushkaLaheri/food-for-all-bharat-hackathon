"use client";


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, Filter, MapPin, Search } from "lucide-react";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Donation = {
  id: string;
  image: string;
  name: string;
  category: string;
  distance: number;
  description: string;
  time: string;
  expires: string;
};

export default function ExplorePage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [distance, setDistance] = useState([5]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock data - replace with your actual API call
      const mockDonations: Donation[] = [
        {
          id: "1",
          image: "/veg platter.jpg",
          name: "Fresh Vegetable Platter",
          category: "Vegetables",
          distance: 2.5,
          description: "Assorted fresh vegetables from local farm",
          time: "2 hours ago",
          expires: "12 hours"
        },
        {
          id: "2",
          image: "/lasanga.jpg",
          name: "Homemade Lasagna",
          category: "Cooked Meal",
          distance: 1.8,
          description: "Freshly made lasagna with meat and cheese",
          time: "1 hour ago",
          expires: "6 hours"
        },
        {
          id: "3",
          image: "/roti.jpg",
          name: "Rotis and Breads",
          category: "Bakery",
          distance: 3.2,
          description: "Various breads from local bakery",
          time: "3 hours ago",
          expires: "24 hours"
        },
        {
          id: "4",
          image: "/fruit basket.jpg",
          name: "Fruit Basket",
          category: "Fruits",
          distance: 4.7,
          description: "Seasonal fruits including apples, bananas and oranges",
          time: "4 hours ago",
          expires: "48 hours"
        },
        {
          id: "5",
          image: "/rice.jpg",
          name: "Rice and Curry",
          category: "Cooked Meal",
          distance: 1.2,
          description: "Vegetable curry with steamed rice",
          time: "30 minutes ago",
          expires: "4 hours"
        },
        {
          id: "6",
          image: "/sandwich.jpg",
          name: "Sandwich Platter",
          category: "Prepared Food",
          distance: 2.9,
          description: "Assorted sandwiches with different fillings",
          time: "5 hours ago",
          expires: "8 hours"
        }
      ];

      // Filter mock data by distance (simulating API filtering)
      const filteredDonations = mockDonations.filter(d => d.distance <= distance[0]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDonations(filteredDonations);

      // For actual API implementation, uncomment and use this:
      /*
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/donations?distance=${distance[0]}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDonations(data);
      */
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to load donations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [distance]);

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Available Food</h1>
        <p className="text-muted-foreground">Browse food donations in your area</p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters (Desktop) */}
        <div className="hidden md:block w-64 shrink-0 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Distance</h3>
                <Slider 
                  defaultValue={[5]} 
                  max={20} 
                  step={1} 
                  value={distance} 
                  onValueChange={setDistance}
                />
                <span className="text-sm text-muted-foreground">{distance[0]} km</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cooked" defaultChecked />
                    <Label htmlFor="cooked">Cooked Meals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bakery" defaultChecked />
                    <Label htmlFor="bakery">Bakery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="produce" defaultChecked />
                    <Label htmlFor="produce">Produce</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={fetchDonations}>
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Search className="h-12 w-12 text-destructive" />              <p className="text-lg text-destructive">{error}</p>
              <Button variant="outline" onClick={fetchDonations}>
                Retry
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                <p className="text-sm text-muted-foreground">
                  Showing {donations.length} items within {distance[0]} km
                </p>
              </div>

              {/* Grid View */}
              <TabsContent value="grid" className="space-y-4">
                {donations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donations.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video relative">
                          <Image 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                            {item.category}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {item.distance} km
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Listed {item.time}</span>
                            <span className="mx-2">•</span>
                            <span>Expires in {item.expires}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" className="w-full">
                            Request Item
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">No donations found within {distance[0]} km</p>
                    <Button variant="outline" onClick={() => setDistance([20])}>
                      Increase search distance
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="space-y-4">
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    {donations.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start">
                              <CardTitle>{item.name}</CardTitle>
                              <Badge variant="outline">{item.distance} km</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                            <div className="flex items-center mt-4 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Listed {item.time}</span>
                              <span className="mx-2">•</span>
                              <span>Expires in {item.expires}</span>
                            </div>
                            <Button size="sm" className="mt-4">
                              Request Item
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">No donations found within {distance[0]} km</p>
                    <Button variant="outline" onClick={() => setDistance([20])}>
                      Increase search distance
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}