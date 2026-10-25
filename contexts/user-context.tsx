"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { StoreItem } from "@/contexts/store-context"

export interface SavedOutfit {
  id: string
  name: string
  image: string
  items: string[]
  createdAt: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: string
  date: string
  total: number
  status: string
  items: OrderItem[]
}

export interface UserAddress {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface UserMeasurements {
  height: number
  weight: number
  chest: number
  waist: number
  hips: number
  inseam: number
  shoulder: number
  sleeve: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  subscription: "free" | "premium" | "business"
  trialUsed: number
  savedOutfits: SavedOutfit[]
  orders: Order[]
  address: UserAddress
  measurements: UserMeasurements
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
  addOrder: (order: Omit<Order, "id" | "date" | "status"> & { status?: string }) => void
}

const emptyAddress: UserAddress = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
}

const emptyMeasurements: UserMeasurements = {
  height: 0,
  weight: 0,
  chest: 0,
  waist: 0,
  hips: 0,
  inseam: 0,
  shoulder: 0,
  sleeve: 0,
}

function createGuestUser(overrides: Partial<User> = {}): User {
  return {
    id: `guest-${Date.now()}`,
    name: "Guest",
    email: "",
    phone: "",
    avatar: "/placeholder.svg?height=200&width=200&text=VF",
    subscription: "free",
    trialUsed: 0,
    savedOutfits: [],
    orders: [],
    address: emptyAddress,
    measurements: emptyMeasurements,
    ...overrides,
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined)
const USER_KEY = "vss-user"

function persist(user: User | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY)
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as User
        setUser({
          ...createGuestUser(),
          ...parsed,
          address: { ...emptyAddress, ...parsed.address },
          measurements: { ...emptyMeasurements, ...parsed.measurements },
          savedOutfits: parsed.savedOutfits || [],
          orders: parsed.orders || [],
        })
      } else {
        const guest = createGuestUser({ id: "guest" })
        setUser(guest)
        persist(guest)
      }
    } catch (err) {
      setError("Failed to load profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const nextUser = createGuestUser({
        ...user,
        id: user?.id || "guest",
        email,
        name: user?.name && user.name !== "Guest" ? user.name : email.split("@")[0],
      })
      setUser(nextUser)
      persist(nextUser)
    } catch (err) {
      setError("Login failed")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    const guest = createGuestUser({ id: "guest" })
    setUser(guest)
    persist(guest)
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const nextUser = createGuestUser({
        ...user,
        id: `user-${Date.now()}`,
        name,
        email,
      })
      setUser(nextUser)
      persist(nextUser)
    } catch (err) {
      setError("Registration failed")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    setError(null)
    if (!user) throw new Error("Not authenticated")
    const updatedUser: User = {
      ...user,
      ...data,
      address: { ...user.address, ...data.address },
      measurements: { ...user.measurements, ...data.measurements },
    }
    setUser(updatedUser)
    persist(updatedUser)
  }

  const saveOutfit = async (outfit: Omit<SavedOutfit, "id" | "createdAt">) => {
    if (!user) throw new Error("Not authenticated")
    const newOutfit: SavedOutfit = {
      ...outfit,
      id: `outfit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    const updatedUser = {
      ...user,
      savedOutfits: [newOutfit, ...user.savedOutfits],
    }
    setUser(updatedUser)
    persist(updatedUser)
  }

  const deleteOutfit = async (outfitId: string) => {
    if (!user) throw new Error("Not authenticated")
    const updatedUser = {
      ...user,
      savedOutfits: user.savedOutfits.filter((outfit) => outfit.id !== outfitId),
    }
    setUser(updatedUser)
    persist(updatedUser)
  }

  const addOrder = (order: Omit<Order, "id" | "date" | "status"> & { status?: string }) => {
    if (!user) return
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: order.status || "Confirmed",
      total: order.total,
      items: order.items,
    }
    const updatedUser = {
      ...user,
      orders: [newOrder, ...user.orders],
    }
    setUser(updatedUser)
    persist(updatedUser)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user?.email,
        login,
        logout,
        register,
        updateProfile,
        saveOutfit,
        deleteOutfit,
        addOrder,
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

export function toOrderItems(items: StoreItem[]): OrderItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: 1,
  }))
}
