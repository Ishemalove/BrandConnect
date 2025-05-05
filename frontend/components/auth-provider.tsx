"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, register as apiRegister } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
  role: "CREATOR" | "BRAND"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: "brand" | "creator") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Decode token to get user info
          const payload = JSON.parse(atob(token.split(".")[1]))
          setUser({
            id: payload.sub,
            email: payload.sub,
            name: payload.name || "",
            role: payload.role as "CREATOR" | "BRAND"
          })
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const { token } = await apiLogin({ email, password })
      
      localStorage.setItem("token", token)

      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser({
        id: payload.sub,
        email: payload.sub,
        name: payload.name || "",
        role: payload.role as "CREATOR" | "BRAND"
      })
      
      // Redirect based on role using uppercase role values
      if (payload.role === "BRAND") {
        router.push("/dashboard")
      } else if (payload.role === "CREATOR") {
        router.push("/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, role: "brand" | "creator") => {
    try {
      setIsLoading(true)
      setError(null)
      const { token } = await apiRegister({
        email,
        password,
        name,
        role: role === "brand" ? "BRAND" : "CREATOR" // Convert to exact enum values
      })
      
      if (!token) {
        throw new Error("Registration failed - no token received")
      }
      
      localStorage.setItem("token", token)
      
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser({
        id: payload.sub,
        email: payload.sub,
        name: payload.name || "",
        role: payload.role as "CREATOR" | "BRAND"
      })
      
      // Redirect to dashboard - the dashboard will show appropriate view based on role
        router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
