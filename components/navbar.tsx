"use client"

import { Bell, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// Function to fetch data from your Flask backend
/*async function fetchNotifications() {
  const apiUrl = 'http://127.0.0.1:5000';  // Change this URL to your Flask API URL
  const response = await fetch(`${apiUrl}/notifications`);  // Replace '/notifications' with your actual endpoint
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  const data = await response.json();
  return data;
}*/

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(0)  // State to hold notifications count
  const [error, setError] = useState<string | null>(null)  // State to hold error message

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch notifications when component mounts
  /*useEffect(() => {
    fetchNotifications()
      .then(data => {
        setNotifications(data.count);  // Assuming your API returns { count: 3 }
      })
      .catch(err => {
        setError('Error fetching notifications');
      });
  }, []);*/

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
            Food for All
          </span>
        </a>
      </div>
      <div className={cn("ml-auto flex items-center gap-4", !mounted && "opacity-0")}>
        <form className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-full bg-background pl-8 md:w-80 lg:w-96"
          />
        </form>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {/* Show the dynamic notifications count */}
          <Badge
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0"
            variant="destructive"
          >
            {notifications}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5 transition-all" />
          ) : (
            <Moon className="h-5 w-5 transition-all" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src="?height=32&width=32" alt="User" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
