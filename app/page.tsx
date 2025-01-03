"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { TrackCard } from "../components/track-card"
import { Player } from "../components/player"
import { PlayerProvider } from "../context/player-context"
import { Search, Menu } from 'lucide-react'
import type { Track, AppState } from "../types/music"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const TRACKS_PER_PAGE = 30

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    tracks: [],
    isLoading: true,
    error: null,
    page: 1,
    hasMore: true
  })
  const [search, setSearch] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const observer = useRef<IntersectionObserver>()
  const { isAuthenticated, logout } = useAuth()
  
  const lastTrackElementRef = useCallback((node: HTMLDivElement) => {
    if (appState.isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && appState.hasMore) {
        setAppState(prev => ({ ...prev, page: prev.page + 1 }))
      }
    })
    if (node) observer.current.observe(node)
  }, [appState.isLoading, appState.hasMore])

  const fetchTracks = async (pageNumber: number) => {
    try {
      setAppState(prev => ({ ...prev, isLoading: true }))
      const offset = (pageNumber - 1) * TRACKS_PER_PAGE
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=04b90385&limit=${TRACKS_PER_PAGE}&offset=${offset}&format=json&include=musicinfo`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.results) {
        throw new Error('No results found in the response')
      }

      const formattedTracks = data.results.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist_name: track.artist_name,
        album_name: track.album_name,
        duration: track.duration,
        audio: track.audio,
        image: track.image || '/placeholder.svg?height=400&width=400',
        shareurl: track.shareurl,
      }))

      setAppState(prev => ({
        ...prev,
        tracks: [...prev.tracks, ...formattedTracks],
        isLoading: false,
        hasMore: formattedTracks.length === TRACKS_PER_PAGE,
        error: null
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setAppState(prev => ({ ...prev, isLoading: false, error: errorMessage }))
    }
  }

  useEffect(() => {
    fetchTracks(appState.page)
  }, [appState.page])

  useEffect(() => {
    document.documentElement.classList.add('dark')

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        searchInput?.focus()
      }
      
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (document.activeElement === searchInput) {
          searchInput.blur()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredTracks = appState.tracks.filter(
    (track) =>
      track.name.toLowerCase().includes(search.toLowerCase()) ||
      track.artist_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAuthRequired = () => {
    setShowAuthModal(true)
  }

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-background font-sans">
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 md:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Musico</h1>
              <svg 
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" 
                viewBox="0 0 48 48" 
                fill="currentColor"
              >
                <g>
                  <g>
                    <path d="M14,46c-3.309,0-6-2.691-6-6s2.691-6,6-6h6v6C20,43.196,17.196,46,14,46z M14,36c-2.206,0-4,1.794-4,4s1.794,4,4,4 c2.289,0,4-2.112,4-4v-4H14z"/>
                    <path d="M34,40c-3.309,0-6-2.691-6-6s2.691-6,6-6h6v6C40,37.196,37.196,40,34,40z M34,30c-2.206,0-4,1.794-4,4s1.794,4,4,4 c2.289,0,4-2.112,4-4v-4H34z"/>
                    <polygon points="20,35 18,35 18,10.323 40,1.523 40,29 38,29 38,4.477 20,11.677"/>
                    <rect height="21.541" transform="matrix(0.3711 0.9286 -0.9286 0.3711 31.24 -18.1245)" width="2" x="28" y="3.23"/>
                  </g>
                </g>
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search tracks... (⌘K)"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="sm:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[200px] sm:w-[280px] bg-background border-white/10">
                  <div className="flex flex-col space-y-4 mt-4">
                    {isAuthenticated ? (
                      <Button onClick={logout} className="bg-white text-black hover:bg-white/90 w-full">Logout</Button>
                    ) : (
                      <Button onClick={() => setShowAuthModal(true)} className="bg-white text-black hover:bg-white/90 w-full">Login</Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <div className="hidden sm:block">
                {isAuthenticated ? (
                  <Button onClick={logout} className="bg-white text-black hover:bg-white/90">Logout</Button>
                ) : (
                  <Button onClick={() => setShowAuthModal(true)} className="bg-white text-black hover:bg-white/90">Login</Button>
                )}
              </div>
            </div>
          </div>
          {appState.error ? (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-md mb-6">
              Error loading tracks: {appState.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredTracks.map((track, index) => {
                if (filteredTracks.length === index + 1) {
                  return (
                    <div ref={lastTrackElementRef} key={track.id}>
                      <TrackCard track={track} onAuthRequired={handleAuthRequired} />
                    </div>
                  )
                } else {
                  return <TrackCard key={track.id} track={track} onAuthRequired={handleAuthRequired} />
                }
              })}
              {appState.isLoading && Array.from({ length: TRACKS_PER_PAGE }).map((_, index) => (
                <Skeleton key={index} className="h-[200px] sm:h-[250px] md:h-[300px] w-full" />
              ))}
            </div>
          )}
        </div>
        <Player />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </PlayerProvider>
  )
}

