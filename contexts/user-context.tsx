"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  subscription: "free" | "premium" | "business"
  trialUsed: number
  savedOutfits: SavedOutfit[]
}

export interface SavedOutfit {
  id: string
  name: string
  image: string
  items: string[] // Item IDs
  createdAt: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  saveOutfit: (outfit: Omit<SavedOutfit, "id" | "createdAt">) => Promise<void>
  deleteOutfit: (outfitId: string) => Promise<void>
}

// Mock user data
const mockUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=200&width=200&text=JD",
  subscription: "free",
  trialUsed: 0,
  savedOutfits: [
    {
      id: "outfit-1",
      name: "Summer Casual",
      image: "/placeholder.svg?height=400&width=300&text=Outfit1",
      items: ["item-1", "item-2", "item-3"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "outfit-2",
      name: "Work Attire",
      image: "/placeholder.svg?height=400&width=300&text=Outfit2",
      items: ["item-4", "item-5", "item-6"],
      createdAt: new Date().toISOString(),
    },
  ],
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the session with the backend
        // For now, we'll check localStorage
        const savedUser = localStorage.getItem("user")

        if (savedUser) {
          setUser(JSON.parse(savedUser))
        } else {
          // For demo purposes, auto-login with mock user
          setUser(mockUser)
          localStorage.setItem("user", JSON.stringify(mockUser))
        }
      } catch (err) {
        setError("Failed to authenticate")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo, just set the mock user
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (err) {
      setError("Login failed")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new user based on the mock
      const newUser: User = {
        ...mockUser,
        id: `user-${Date.now()}`,
        name,
        email,
        savedOutfits: [],
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (err) {
      setError("Registration failed")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!user) throw new Error("Not authenticated")

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (err) {
      setError("Failed to update profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const saveOutfit = async (outfit: Omit<SavedOutfit, "id" | "createdAt">) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!user) throw new Error("Not authenticated")

      const newOutfit: SavedOutfit = {
        ...outfit,
        id: `outfit-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      const updatedUser = {
        ...user,
        savedOutfits: [...user.savedOutfits, newOutfit],
      }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (err) {
      setError("Failed to save outfit")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteOutfit = async (outfitId: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!user) throw new Error("Not authenticated")

      const updatedUser = {
        ...user,
        savedOutfits: user.savedOutfits.filter((outfit) => outfit.id !== outfitId),
      }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (err) {
      setError("Failed to delete outfit")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        saveOutfit,
        deleteOutfit,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

