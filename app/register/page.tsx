'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, getErrorMessage } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Header from "@/components/header";
import { useToast } from "@/components/ui/use-toast";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'consumer' as 'consumer' | 'donor' | 'ngo'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords do not match",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const { confirmPassword, ...registrationData } = formData;

    const mappedData = {
      name: registrationData.name,
      email: registrationData.email,
      phone: registrationData.phone,
      address: registrationData.address,
      password: registrationData.password,
      role: registrationData.role
    };

    const response = await register(mappedData);

    toast({
      title: "Registration Successful!",
      description: response.message || "Your account has been created successfully!",
      variant: "default",
      duration: 5000,
    });

    setTimeout(() => {
      router.push("/login");
    }, 2000);

  } catch (error) {
    toast({
      title: "Registration Error",
      description: getErrorMessage(error)
        ? "This email is already registered. Try logging in or use another email."
        : "An error occurred during registration. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen flex flex-col">
      <Header showAccount={false} />
      <div className="flex-1 flex items-center justify-center p-6 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/placeholder.svg?height=800&width=1200')",
        }}>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Food For All</h1>
          <h2 className="text-xl font-semibold mb-6">Register Now</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Register as</Label>
              <select
                id="role"
                className="w-full p-2 border rounded-md"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="consumer">Consumer</option>
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
              </select>
            </div>
            
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Register"}
            </Button>
            
          </form>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}