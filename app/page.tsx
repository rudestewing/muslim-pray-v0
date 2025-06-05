"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Home, BookOpen } from "lucide-react"
import prayersData from "@/data/prayers.json"

interface Prayer {
  id: string
  title: string
  category: string
  arabic: string
  transliteration: string
  translation: string
}

const categoryColors = {
  opening: "bg-green-100 text-green-800 border-green-200",
  recitation: "bg-blue-100 text-blue-800 border-blue-200",
  movement: "bg-purple-100 text-purple-800 border-purple-200",
  sitting: "bg-orange-100 text-orange-800 border-orange-200",
  closing: "bg-red-100 text-red-800 border-red-200",
}

const categoryNames = {
  opening: "Pembukaan",
  recitation: "Bacaan",
  movement: "Gerakan",
  sitting: "Duduk",
  closing: "Penutup",
}

export default function PrayerGuide() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showOverview, setShowOverview] = useState(true)
  const prayers: Prayer[] = prayersData.prayers

  const currentPrayer = prayers[currentIndex]

  const nextPrayer = () => {
    setCurrentIndex((prev) => (prev + 1) % prayers.length)
  }

  const prevPrayer = () => {
    setCurrentIndex((prev) => (prev - 1 + prayers.length) % prayers.length)
  }

  const goToPrayer = (index: number) => {
    setCurrentIndex(index)
    setShowOverview(false)
  }

  if (showOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Panduan Shalat</h1>
            </div>
            <p className="text-gray-600 text-sm">Bacaan dan doa dalam shalat wajib</p>
          </div>

          <div className="space-y-3">
            {prayers.map((prayer, index) => (
              <Card
                key={prayer.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => goToPrayer(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${categoryColors[prayer.category as keyof typeof categoryColors]}`}
                        >
                          {categoryNames[prayer.category as keyof typeof categoryNames]}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{prayer.title}</h3>
                      <p className="text-right text-lg text-gray-700 font-arabic leading-relaxed">
                        {prayer.arabic.length > 50 ? `${prayer.arabic.substring(0, 50)}...` : prayer.arabic}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setShowOverview(true)} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Daftar
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentIndex + 1} dari {prayers.length}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${categoryColors[currentPrayer.category as keyof typeof categoryColors]}`}
          >
            {categoryNames[currentPrayer.category as keyof typeof categoryNames]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">{currentPrayer.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Text */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Arab</h3>
                <p className="text-right text-2xl leading-loose text-gray-800 font-arabic p-4 bg-gray-50 rounded-lg">
                  {currentPrayer.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Latin</h3>
                <p className="text-lg leading-relaxed text-gray-700 italic p-4 bg-blue-50 rounded-lg">
                  {currentPrayer.transliteration}
                </p>
              </div>

              {/* Translation */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Arti</h3>
                <p className="text-base leading-relaxed text-gray-800 p-4 bg-green-50 rounded-lg">
                  {currentPrayer.translation}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevPrayer}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          <div className="flex gap-1">
            {prayers.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={nextPrayer}
            disabled={currentIndex === prayers.length - 1}
            className="flex items-center gap-2"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
