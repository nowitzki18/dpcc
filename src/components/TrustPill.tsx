"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertTriangle } from "lucide-react"
import { TrustLevel } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TrustPillProps {
  level: TrustLevel
  verified?: boolean
  trustScore?: number
  className?: string
}

export function TrustPill({ level, verified, trustScore, className }: TrustPillProps) {
  const getVariant = () => {
    if (level === "high") return "default"
    if (level === "medium") return "secondary"
    return "destructive"
  }

  const getIcon = () => {
    if (verified) return <CheckCircle className="h-3 w-3 mr-1" />
    if (level === "high") return <Shield className="h-3 w-3 mr-1" />
    return <AlertTriangle className="h-3 w-3 mr-1" />
  }

  return (
    <Badge variant={getVariant()} className={cn("flex items-center", className)}>
      {getIcon()}
      <span>
        {verified && "Verified • "}
        {level === "high" ? "High Trust" : level === "medium" ? "Medium Trust" : "Low Trust"}
        {trustScore !== undefined && ` (${trustScore})`}
      </span>
    </Badge>
  )
}

