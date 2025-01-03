"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Shuffle, MoreVertical, Volume2 } from 'lucide-react'
import { usePlayer } from "../context/player-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy } from 'lucide-react'
import { formatTime } from "../utils/format-time"

export function Player() {
  const { 
    currentTrack, 
    isPlaying, 
    play, 
    pause, 
    next, 
    previous, 
    volume, 
    setVolume,
    progress,
    duration,
    setProgress,
    shuffle,
    toggleShuffle
  } = usePlayer()

  if (!currentTrack) return null

  const copyLink = () => {
    navigator.clipboard.writeText(currentTrack.shareurl)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 p-2 sm:p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <img src={currentTrack.image} alt={currentTrack.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-md" />
          <div className="flex-1 sm:flex-initial min-w-0">
            <h4 className="font-medium leading-none text-white text-sm sm:text-base truncate">{currentTrack.name}</h4>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{currentTrack.artist_name}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={previous} 
              className="text-white hover:text-white/80"
            >
              <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              size="icon" 
              onClick={() => (isPlaying ? pause() : play(currentTrack))}
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={next} 
              className="text-white hover:text-white/80"
            >
              <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleShuffle}
              className={`text-white hover:text-white/80 ${shuffle ? 'bg-primary/20' : ''}`}
            >
              <Shuffle className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-xs text-gray-400 w-8 sm:w-12 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={(value) => setProgress(value[0])}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-8 sm:w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
          <div className="hidden sm:flex items-center gap-2">
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <Slider 
              className="w-[100px]" 
              value={[volume]} 
              max={100} 
              step={1}
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={copyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

