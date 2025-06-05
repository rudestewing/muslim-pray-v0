"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Home, BookOpen, RotateCcw, Download, Wifi, WifiOff } from "lucide-react"
import prayersData from "@/data/prayers.json"

interface PrayerVersion {
  name: string
  arabic: string
  transliteration: string
  translation: string
}

interface Prayer {
  id: string
  title: string
  category: string
  versions: PrayerVersion[]
}

const categoryColors = {
  opening: "bg-amber-100 text-amber-800 border-amber-200",
  recitation: "bg-orange-100 text-orange-800 border-orange-200",
  movement: "bg-red-100 text-red-800 border-red-200",
  sitting: "bg-yellow-100 text-yellow-800 border-yellow-200",
  closing: "bg-rose-100 text-rose-800 border-rose-200",
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
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0)
  const [showOverview, setShowOverview] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const prayers: Prayer[] = prayersData.prayers

  const currentPrayer = prayers[currentIndex]
  const currentVersion = currentPrayer?.versions[currentVersionIndex]

  // Check online status
  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show install button
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We no longer need the prompt
    setDeferredPrompt(null)
    setShowInstallPrompt(false)

    console.log(`User ${outcome === "accepted" ? "accepted" : "dismissed"} the install prompt`)
  }

  const nextPrayer = () => {
    setCurrentIndex((prev) => (prev + 1) % prayers.length)
    setCurrentVersionIndex(0) // Reset to first version when changing prayer
  }

  const prevPrayer = () => {
    setCurrentIndex((prev) => (prev - 1 + prayers.length) % prayers.length)
    setCurrentVersionIndex(0) // Reset to first version when changing prayer
  }

  const nextVersion = () => {
    setCurrentVersionIndex((prev) => (prev + 1) % currentPrayer.versions.length)
  }

  const prevVersion = () => {
    setCurrentVersionIndex((prev) => (prev - 1 + currentPrayer.versions.length) % currentPrayer.versions.length)
  }

  const goToPrayer = (index: number) => {
    setCurrentIndex(index)
    setCurrentVersionIndex(0)
    setShowOverview(false)
  }

  if (showOverview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-amber-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">Panduan Shalat</h1>
            </div>
            <p className="text-gray-600 text-sm">Bacaan dan doa dalam shalat wajib dengan berbagai versi</p>

            {/* Online/Offline Status */}
            <div className="flex justify-center mt-2">
              <Badge
                variant="outline"
                className={`text-xs ${isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" /> Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" /> Offline
                  </>
                )}
              </Badge>
            </div>

            {/* Install PWA Button */}
            {showInstallPrompt && (
              <Button
                onClick={installApp}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
                size="sm"
              >
                <Download className="w-4 h-4" />
                Pasang Aplikasi
              </Button>
            )}
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
                        {prayer.versions.length > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            {prayer.versions.length} versi
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{prayer.title}</h3>
                      <p className="text-right text-lg text-gray-700 font-arabic leading-relaxed">
                        {prayer.versions[0].arabic.length > 50
                          ? `${prayer.versions[0].arabic.substring(0, 50)}...`
                          : prayer.versions[0].arabic}
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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
            {currentPrayer.versions.length > 1 && (
              <p className="text-xs text-gray-500">
                Versi {currentVersionIndex + 1} dari {currentPrayer.versions.length}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${categoryColors[currentPrayer.category as keyof typeof categoryColors]}`}
            >
              {categoryNames[currentPrayer.category as keyof typeof categoryNames]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-32">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">{currentPrayer.title}</CardTitle>
              {currentPrayer.versions.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="outline" className="text-sm">
                    {currentVersion.name}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Arabic Text */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Arab</h3>
                <p className="text-right text-2xl leading-loose text-gray-800 font-arabic p-4 bg-amber-50 rounded-lg">
                  {currentVersion.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Latin</h3>
                <p className="text-lg leading-relaxed text-gray-700 italic p-4 bg-orange-50 rounded-lg">
                  {currentVersion.transliteration}
                </p>
              </div>

              {/* Translation */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Arti</h3>
                <p className="text-base leading-relaxed text-gray-800 p-4 bg-yellow-50 rounded-lg">
                  {currentVersion.translation}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Version Navigation (if multiple versions exist) */}
      {currentPrayer.versions.length > 1 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={prevVersion} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Versi Lain
            </Button>

            <div className="flex gap-1">
              {currentPrayer.versions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentVersionIndex ? "bg-orange-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={nextVersion} className="flex items-center gap-2">
              Versi Lain
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
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
                  index === currentIndex ? "bg-amber-600" : "bg-gray-300"
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
