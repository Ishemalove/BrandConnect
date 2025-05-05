"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, register as apiRegister } from "@/lib/api"

interface AuthContextType {
  user: any | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, userType: "brand" | "creator") => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token")
    if (token) {
      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser({
          email: payload.sub,
          role: payload.role.replace("[", "").replace("]", "")
        })
      } catch (e) {
        localStorage.removeItem("token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const { token } = await apiLogin({ email, password })
      localStorage.setItem("token", token)
      
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser({
        email: payload.sub,
        role: payload.role.replace("[", "").replace("]", "")
      })
      
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, userType: "brand" | "creator") => {
    try {
      setError(null)
      const { token } = await apiRegister({
        email,
        password,
        fullName: name,
        role: userType.toUpperCase() as "CREATOR" | "BRAND"
      })
      
      localStorage.setItem("token", token)
      
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser({
        email: payload.sub,
        role: payload.role.replace("[", "").replace("]", "")
      })
      
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
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