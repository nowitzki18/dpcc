"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecommendationSignal } from "@/lib/types"
import { Info } from "lucide-react"

interface ExplainabilityBadgeProps {
  signals: RecommendationSignal[]
  className?: string
}

export function ExplainabilityBadge({ signals, className }: ExplainabilityBadgeProps) {
  const topSignals = signals.slice(0, 3).sort((a, b) => b.strength - a.strength)

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">Why we recommend this</h4>
        </div>
        <ul className="space-y-2">
          {topSignals.map((signal, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">
                {idx + 1}
              </Badge>
              <div className="flex-1">
                <p className="text-sm">{signal.description}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${signal.strength}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

