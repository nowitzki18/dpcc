"use client"

import { Book } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BookCoverProps {
  book: Book
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BookCover({ book, size = "md", className }: BookCoverProps) {
  const sizeClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
  }

  // Generate a consistent color based on book ID
  const getColorFromId = (id: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-red-400 to-red-600",
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-teal-400 to-teal-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-cyan-400 to-cyan-600",
    ]
    const index = parseInt(id.replace(/\D/g, "")) || 0
    return colors[index % colors.length]
  }

  const getInitials = (title: string) => {
    const words = title.split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return title.substring(0, 2).toUpperCase()
  }

  const colorClass = getColorFromId(book.id)
  const initials = getInitials(book.title)

  return (
    <div
      className={cn(
        "aspect-[2/3] rounded-lg shadow-md flex items-center justify-center text-white font-bold relative overflow-hidden",
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {/* Pattern overlay for texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,.1) 10px,
            rgba(255,255,255,.1) 20px
          )`
        }} />
      </div>
      
      {/* Book title text */}
      <div className="relative z-10 text-center px-4">
        <div className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
          {initials}
        </div>
        <div className="text-xs md:text-sm font-normal opacity-90 line-clamp-2 drop-shadow">
          {book.title}
        </div>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-black/10 rounded-tr-full" />
    </div>
  )
}

