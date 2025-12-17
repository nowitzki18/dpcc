"use client"

import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"

interface ShareCardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function ShareCard({ children, title, className }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `${title || "share-card"}-${Date.now()}.png`
      link.href = url
      link.click()
    } catch (error) {
      console.error("Failed to generate image:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        })
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), "image/png")
        })
        const file = new File([blob], `${title || "share-card"}.png`, { type: "image/png" })
        await navigator.share({
          title: title || "GreatReads Share",
          files: [file],
        })
      } catch (error) {
        console.error("Failed to share:", error)
      }
    } else {
      handleDownload()
    }
  }

  return (
    <div className={className}>
      <div ref={cardRef} className="p-6 bg-white rounded-lg border shadow-sm">
        {children}
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}

