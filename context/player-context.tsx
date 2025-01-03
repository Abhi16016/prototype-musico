"use client"

import { createContext, useContext, useState, useRef, useEffect } from "react"
import type { Track } from "../types/music"

interface PlayerContextType {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  play: (track: Track) => void
  pause: () => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  next: () => void
  previous: () => void
  shuffle: boolean
  toggleShuffle: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setProgress(0)
      next()
    })

    return () => {
      audio.removeEventListener('loadedmetadata', () => {})
      audio.removeEventListener('ended', () => {})
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  const play = (track: Track) => {
    if (!audioRef.current) return

    if (currentTrack?.id !== track.id) {
      setCurrentTrack(track)
      audioRef.current.src = track.audio
    }

    audioRef.current.play()
    setIsPlaying(true)

    progressInterval.current = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime)
      }
    }, 1000)
  }

  const pause = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    setIsPlaying(false)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }

  const updateVolume = (value: number) => {
    if (!audioRef.current) return

    audioRef.current.volume = value / 100
    setVolume(value)
  }

  const updateProgress = (value: number) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = value
    setProgress(value)
  }

  const next = () => {
    // Implement next track logic
    console.log('Next track')
  }

  const previous = () => {
    // Implement previous track logic
    console.log('Previous track')
  }

  const toggleShuffle = () => {
    setShuffle(prev => !prev)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        play,
        pause,
        setVolume: updateVolume,
        setProgress: updateProgress,
        next,
        previous,
        shuffle,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

