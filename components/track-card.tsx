import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { usePlayer } from "../context/player-context";
import type { Track } from "../types/music";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface TrackCardProps {
  track: Track;
  onAuthRequired: () => void;
}

export function TrackCard({ track, onAuthRequired }: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause } = usePlayer();
  const { isAuthenticated } = useAuth();
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlayClick = () => {
    if (!isAuthenticated) {
      onAuthRequired();
    } else {
      isCurrentTrack && isPlaying ? pause() : play(track);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-background/95 border-0 transition-transform hover:scale-105">
      <CardContent className="p-0">
        <div className="relative w-full h-0 pb-[100%]">
          <Image
            src={track.image}
            alt={track.name}
            fill
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:scale-110 transition-transform"
              onClick={handlePlayClick}
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="font-medium text-sm sm:text-base text-white leading-tight line-clamp-1">
            {track.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
            {track.artist_name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
