"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Maximize } from "lucide-react";
import { useRef, useState } from "react";

interface RecordingReviewProps {
  videoUrl?: string;
}

export function RecordingReview({ videoUrl }: RecordingReviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        /* Firefox */
        (videoRef.current as any).mozRequestFullScreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        /* IE/Edge */
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recording Review</h3>
      <Card className="overflow-hidden">
        <div
          className="relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <div className="aspect-video relative bg-black">
            {videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="object-cover w-full h-full cursor-pointer"
                  onClick={handleVideoClick}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  playsInline
                />
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                    onClick={handleVideoClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
                {showControls && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFullscreen}
                    className="absolute bottom-2 right-2 text-white hover:text-gray-300 bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                Video source not available.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
