import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface HeaderProps {
  showGallery?: boolean
  showContact?: boolean
  showAccount?: boolean
  userType?: "donor" | "ngo" | "consumer"
}

export default function Header({
  showGallery = true,
  showContact = true,
  showAccount = true,
  userType = "consumer",
}: HeaderProps) {
  return (
    <header className="bg-black text-white p-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold">
        FoodForAll
      </Link>
      <div className="flex items-center gap-4">
        {userType === "consumer" && (
          <Link href="/available-foods">
            <Button variant="link" className="text-white">
              View Available Foods
            </Button>
          </Link>
        )}
        {showGallery && (
          <Link href="/gallery">
            <Button variant="link" className="text-white">
              Gallery
            </Button>
          </Link>
        )}
        {showContact && (
          <Link href="/contact-us">
            <Button variant="link" className="text-white">
              Contact Us
            </Button>
          </Link>
        )}
        {showAccount && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="text-white flex items-center">
                My Account <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

