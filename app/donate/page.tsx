"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronRight, Clock, Info, MapPin, UploadCloud, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"


export default function DonatePage() {
  const [date, setDate] = useState<Date>()
  const [step, setStep] = useState(1)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false);  // Add this line with your other useState hooks

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show toast notification
    toast({
      title: "Donation submitted!",
      description: "Thank you for your generosity. Your donation has been listed.",
      action: (
        <div className="h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-emerald-500" />
        </div>
      ),
    });
  
    // Set submitted state to show thank you page
    setSubmitted(true);
    
    // Reset form after submission if needed
    setStep(1)
    setImage(null)
    setPreview(null)
    setDate(undefined)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  
  const triggerFileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };
  
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6 animate-fade-in">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Donate Food</h1>
        <p className="text-muted-foreground">Share your surplus food with those who need it most</p>
      </div>

      <Tabs defaultValue="one-time" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="one-time">One-time Donation</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Donation</TabsTrigger>
        </TabsList>

        <TabsContent value="one-time" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Donation Details</CardTitle>
                  <CardDescription>Provide information about the food you're donating</CardDescription>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      step >= 1 ? "bg-emerald-500 text-white" : "border",
                    )}
                  >
                    1
                  </span>
                  <ChevronRight className="h-4 w-4" />
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      step >= 2 ? "bg-emerald-500 text-white" : "border",
                    )}
                  >
                    2
                  </span>
                  <ChevronRight className="h-4 w-4" />
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      step >= 3 ? "bg-emerald-500 text-white" : "border",
                    )}
                  >
                    3
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
  <form onSubmit={handleSubmit} className="space-y-8">
    {step === 1 && (
      <div className="space-y-4 animate-fade-in">
        <div className="space-y-2">
          <Label>Food Image</Label>
          <div 
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {preview ? (
              <div className="relative">
                <div className="flex items-center justify-center min-h-[200px] max-h-[400px] overflow-hidden rounded-lg mb-2">
                  <img 
                    src={preview} 
                    alt="Food preview" 
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage()
                  }}
                  className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 shadow-sm hover:bg-gray-100 backdrop-blur-sm"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            <Button 
              type="button"
              variant="outline" 
              className="mt-3"
              onClick={triggerFileInput}
            >
              {preview ? "Change Image" : "Select Image"}
            </Button>
          </div>
        </div>
      

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="food-name">Food Name</Label>
                        <Input id="food-name" placeholder="e.g., Homemade Lasagna" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cooked">Cooked Meal</SelectItem>
                            <SelectItem value="produce">Fresh Produce</SelectItem>
                            <SelectItem value="bakery">Bakery Items</SelectItem>
                            <SelectItem value="canned">Canned Goods</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the food, including ingredients and any allergens"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <div className="flex space-x-2">
                          <Input id="quantity" type="number" min="1" placeholder="e.g., 4" />
                          <Select defaultValue="servings">
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="servings">Servings</SelectItem>
                              <SelectItem value="items">Items</SelectItem>
                              <SelectItem value="kg">Kilograms</SelectItem>
                              <SelectItem value="lbs">Pounds</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prepared-date">When was it prepared?</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiry">Best before</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Input id="expiry-days" type="number" min="0" placeholder="Days" />
                          <span className="text-sm text-muted-foreground">Days</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input id="expiry-hours" type="number" min="0" max="23" placeholder="Hours" />
                          <span className="text-sm text-muted-foreground">Hours</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Info className="h-3 w-3 mr-1" />
                        How long will this food stay fresh and safe to eat?
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="contains-allergens" />
                      <Label htmlFor="contains-allergens" className="text-sm">
                        This food contains common allergens (nuts, dairy, gluten, etc.)
                      </Label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-address">Pickup Address</Label>
                      <Input id="pickup-address" placeholder="Enter the address for pickup" />
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        This will be visible to verified users only
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Pickup Availability</Label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="pickup-from" className="text-xs text-muted-foreground">
                            From
                          </Label>
                          <Input id="pickup-from" type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pickup-to" className="text-xs text-muted-foreground">
                            To
                          </Label>
                          <Input id="pickup-to" type="time" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Pickup Days</Label>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox id={`day-${day.toLowerCase()}`} />
                            <Label htmlFor={`day-${day.toLowerCase()}`} className="text-sm">
                              {day}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-preference">Contact Preference</Label>
                      <Select defaultValue="app">
                        <SelectTrigger id="contact-preference">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">In-app messaging</SelectItem>
                          <SelectItem value="phone">Phone call</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea id="notes" placeholder="Any special instructions for pickup?" rows={2} />
                    </div>
                  </div>
                )}

<div className="flex justify-end">
  {step === 1 && (
    <Button type="button" onClick={() => setStep(2)}>
      Continue
    </Button>
  )}
  {step === 2 && (
    <Button type="button" onClick={() => setStep(3)}>
      Continue
    </Button>
  )}
  {step === 3 && (
    <Button type="submit">Submit Donation</Button>
  )}
</div>

{/* Add this right after your step navigation but before closing form */}
{submitted && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg max-w-md w-full text-center">
      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-emerald-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Thank You for Your Donation!
      </h1>
      <p className="text-muted-foreground mb-8">
        Your generosity will help feed those in need.
      </p>
      <Button 
        onClick={() => {
          setSubmitted(false);
          setStep(1);
        }}
        className="w-full"
      >
        Make Another Donation
      </Button>
    </div>
  </div>
)}

</form>
             
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Tips</CardTitle>
              <CardDescription>Guidelines to ensure your donation helps others effectively</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Freshness Matters</h4>
                  <p className="text-sm text-muted-foreground">
                    Be honest about when food was prepared and how long it will stay fresh.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Detailed Descriptions</h4>
                  <p className="text-sm text-muted-foreground">
                    Include all ingredients and potential allergens to keep recipients safe.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Convenient Pickup</h4>
                  <p className="text-sm text-muted-foreground">
                    Set pickup times that work for both you and potential recipients.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Donation</CardTitle>
              <CardDescription>Set up a regular donation schedule</CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="bg-muted p-3 rounded-full">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  We're working on a feature to let you set up recurring donations. This will be perfect for businesses
                  and regular donors.
                </p>
                <Button variant="outline" className="mt-2">
                  Get Notified When Available
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}