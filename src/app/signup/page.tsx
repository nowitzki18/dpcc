"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { setCurrentUser, users } = useStore()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "reader" as const,
      trustScore: 50,
      verifiedReader: false,
      createdAt: new Date().toISOString(),
    }

    setCurrentUser(newUser)
    toast({
      title: "Welcome!",
      description: "Account created successfully",
    })
    router.push("/onboarding")
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Join GreatReads to discover personalized book recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

