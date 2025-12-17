"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
  size?: "sm" | "md" | "lg"
  readonly?: boolean
}

export function RatingInput({ value, onChange, size = "md", readonly = false }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (starIndex: number, quarter: number) => {
    if (!readonly) {
      const rating = starIndex + quarter
      onChange(Math.min(5, Math.max(0, rating)))
    }
  }

  const handleMouseMove = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (readonly) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const width = rect.width
    const quarter = Math.floor((x / width) * 4) / 4
    const rating = starIndex + quarter
    setHoverValue(Math.min(5, Math.max(0, rating)))
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null)
    }
  }

  const displayValue = hoverValue ?? value

  const getStarFill = (starIndex: number) => {
    const starValue = starIndex + 1
    if (displayValue >= starValue) return 1
    if (displayValue >= starValue - 0.75) return 0.75
    if (displayValue >= starValue - 0.5) return 0.5
    if (displayValue >= starValue - 0.25) return 0.25
    return 0
  }

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const fill = getStarFill(starIndex)
        const isFilled = fill > 0

        return (
          <button
            key={starIndex}
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const width = rect.width
              const quarter = Math.floor((x / width) * 4) / 4
              handleClick(starIndex, quarter)
            }}
            onMouseMove={(e) => handleMouseMove(starIndex, e)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={cn(
              "relative transition-colors",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? "text-yellow-400" : "text-muted-foreground"
              )}
            />
            {fill > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className={cn(sizeClasses[size], "fill-yellow-400 text-yellow-400")}
                />
              </div>
            )}
          </button>
        )
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? value.toFixed(2) : "Not rated"}
      </span>
    </div>
  )
}

