"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Award, Calendar, Camera, Edit, Gift, MapPin, Medal, Settings, Star, User } from "lucide-react"
import Image from "next/image"
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProfile, updateProfile, uploadProfilePicture, getErrorMessage } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // User profile state
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "I'm passionate about reducing food waste and helping my community."
  });
  
  // Check authentication and fetch profile data
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (!storedToken || !storedUserId) {
      // Redirect to login if not authenticated
      toast({
        title: "Authentication Required",
        description: "Please login to view your profile",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    setToken(storedToken);
    setUserId(storedUserId);
    
    // Fetch user profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await getProfile(Number(storedUserId), storedToken);
        
        if (response.status === 'success' && response.data) {
          setProfileData(response.data);
          // Update form data with profile information
          setFormData({
            name: response.data.full_name || "",
            email: response.data.email || "",
            phone: response.data.phone_number || "",
            address: response.data.address || "",
            bio: "I'm passionate about reducing food waste and helping my community."
          });
          
          // Set profile image if available
          if (response.data.profile_picture) {
            setProfileImage(response.data.profile_picture);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        setError(getErrorMessage(err));
        toast({
          title: "Error",
          description: getErrorMessage(err),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [router, toast]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !token) return;
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Upload to server
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await uploadProfilePicture(Number(userId), token, file);
      
      if (response.status === 'success') {
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
        
        // Update profile image with the URL from the server if provided
        if (response.data?.profile_picture) {
          setProfileImage(response.data.profile_picture);
        }
      } else {
        throw new Error(response.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  }, [userId, token, toast]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Handle form submission
  const handleSaveChanges = async () => {
    if (!userId || !token) return;
    
    try {
      const response = await updateProfile(Number(userId), token, formData);
      
      if (response.status === 'success') {
        setEditMode(false);
        setProfileData((prev: any) => ({
          ...prev,
          ...formData
        }));
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  const achievements = [
    {
      id: 1,
      name: "First Donation",
      description: "Made your first food donation",
      icon: Gift,
      date: "Jan 15, 2023",
      unlocked: true,
    },
    {
      id: 2,
      name: "Regular Donor",
      description: "Donated food 5 times",
      icon: Calendar,
      date: "Mar 22, 2023",
      unlocked: true,
    },
    {
      id: 3,
      name: "Neighborhood Hero",
      description: "Donated to 10 different people",
      icon: MapPin,
      date: "May 10, 2023",
      unlocked: true,
    },
    {
      id: 4,
      name: "Variety Master",
      description: "Donated 5 different types of food",
      icon: Award,
      date: "Jun 5, 2023",
      unlocked: true,
    },
    {
      id: 5,
      name: "Silver Status",
      description: "Reached Silver donor status",
      icon: Medal,
      date: null,
      unlocked: false,
      progress: 72,
    },
    {
      id: 6,
      name: "Community Champion",
      description: "Helped 50+ people with your donations",
      icon: Star,
      date: null,
      unlocked: false,
      progress: 64,
    },
  ]

  const donationHistory = [
    {
      id: 1,
      name: "Homemade Lasagna",
      category: "Cooked Meal",
      date: "May 15, 2023",
      recipient: "Maria Garcia",
      image: "/placeholder.svg?height=80&width=80&text=Lasagna",
    },
    {
      id: 2,
      name: "Fresh Bread Assortment",
      category: "Bakery",
      date: "May 2, 2023",
      recipient: "John Smith",
      image: "/placeholder.svg?height=80&width=80&text=Bread",
    },
    {
      id: 3,
      name: "Vegetable Soup",
      category: "Cooked Meal",
      date: "Apr 28, 2023",
      recipient: "Emily Johnson",
      image: "/placeholder.svg?height=80&width=80&text=Soup",
    },
    {
      id: 4,
      name: "Fruit Basket",
      category: "Produce",
      date: "Apr 15, 2023",
      recipient: "David Lee",
      image: "/placeholder.svg?height=80&width=80&text=Fruit",
    },
    {
      id: 5,
      name: "Rice and Curry",
      category: "Cooked Meal",
      date: "Apr 10, 2023",
      recipient: "Sarah Williams",
      image: "/placeholder.svg?height=80&width=80&text=Curry",
    },
  ]

  // Show loading state
  if (loading) {
    return (
      <div className="container py-8 px-4 md:px-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error && !profileData) {
    return (
      <div className="container py-8 px-4 md:px-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
            <p>Error loading profile: {error}</p>
            <Button 
              onClick={() => router.push('/login')} 
              className="mt-4"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and track your impact</p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-2 space-y-6">
          <Card className="animate-fade-in-up">
            <CardHeader className="relative pb-2">
              <div className="absolute right-4 top-4">
                <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col items-center">
  <div className="relative">
    <Avatar className="h-24 w-24">
      <AvatarImage 
        src={profileImage || "/flower.jpg"} 
        alt="Profile" 
      />
      <AvatarFallback>
        {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
      </AvatarFallback>
    </Avatar>
    {editMode && (
      <label htmlFor="profile-upload" className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground cursor-pointer">
        <input 
          id="profile-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageUpload}
        />
        <Camera className="h-4 w-4" />
      </label>
    )}
  </div>
  <CardTitle className="mt-4">{formData.name || "User"}</CardTitle>
  <CardDescription>
    <Badge className="mt-1 bg-amber-700 text-white">
      {profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'User'}
    </Badge>
  </CardDescription>
</div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      disabled // Email should not be editable
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">About</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{formData.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Contact Information</p>
                      <p className="text-sm text-muted-foreground">
                        Email: {formData.email}<br />
                        Phone: {formData.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Next Level: Silver</p>
                      <span className="text-xs text-muted-foreground">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <p className="text-xs text-muted-foreground">5 more donations to reach Silver status</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animation-delay-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-emerald-500" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your donations</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="privacy">Profile Privacy</Label>
                  <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                </div>
                <Switch id="privacy" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="leaderboard">Show on Leaderboard</Label>
                  <p className="text-sm text-muted-foreground">Display your ranking on the leaderboard</p>
                </div>
                <Switch id="leaderboard" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5 space-y-6">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="history">Donation History</TabsTrigger>
              <TabsTrigger value="impact">Your Impact</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Badges and milestones you've earned through your donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={cn(
                          "flex items-start space-x-4 p-4 rounded-lg border",
                          !achievement.unlocked && "opacity-60",
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full",
                            achievement.unlocked
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">{achievement.name}</h4>
                            {achievement.unlocked && (
                              <Badge className="ml-2 bg-emerald-500 text-white text-xs">Unlocked</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <p className="text-xs text-muted-foreground">Achieved on {achievement.date}</p>
                          ) : (
                            <div className="space-y-1 pt-1">
                              <Progress value={achievement.progress} className="h-1" />
                              <p className="text-xs text-muted-foreground">{achievement.progress}% complete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Record of all your food donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donationHistory.map((donation) => (
                      <div key={donation.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                        <div className="relative h-20 w-20 overflow-hidden rounded">
                          <Image
                            src={donation.image || "/placeholder.svg"}
                            alt={donation.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{donation.name}</h4>
                            <Badge variant="outline">{donation.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Donated to: {donation.recipient}</p>
                          <p className="text-xs text-muted-foreground">{donation.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Donations
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                  <CardDescription>The difference you've made in your community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center space-y-2 p-6 bg-muted/50 rounded-lg">
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Gift className="h-6 w-6" />
                      </div>
                      <h3 className="text-3xl font-bold">18</h3>
                      <p className="text-sm text-muted-foreground">Total Donations</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2 p-6 bg-muted/50 rounded-lg">
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <User className="h-6 w-6" />
                      </div>
                      <h3 className="text-3xl font-bold">54</h3>
                      <p className="text-sm text-muted-foreground">People Helped</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2 p-6 bg-muted/50 rounded-lg">
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <Award className="h-6 w-6" />
                      </div>
                      <h3 className="text-3xl font-bold">540</h3>
                      <p className="text-sm text-muted-foreground">Impact Score</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Environmental Impact</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Food Waste Reduced</span>
                          <span className="text-sm font-medium">24 kg</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">CO₂ Emissions Saved</span>
                          <span className="text-sm font-medium">48 kg</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Water Saved</span>
                          <span className="text-sm font-medium">1,200 L</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Community Impact</h3>
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <p className="text-sm">
                        Your donations have helped approximately 54 people in your community. You've contributed to
                        reducing hunger and building a more sustainable food system.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
  }
