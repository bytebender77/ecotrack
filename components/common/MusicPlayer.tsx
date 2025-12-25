"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio("/music/last-christmas.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.log("Playback failed:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            {/* Volume Control */}
            {isPlaying && (
                <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-300"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? (
                        <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                        <Volume2 className="w-4 h-4 text-emerald-600" />
                    )}
                </button>
            )}

            {/* CD/Disc Button */}
            <button
                onClick={togglePlay}
                className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 ${isPlaying ? "animate-spin-slow" : ""
                    }`}
                style={{
                    animationDuration: isPlaying ? "3s" : "0s",
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                }}
                aria-label={isPlaying ? "Pause music" : "Play music"}
            >
                {/* CD Outer Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 shadow-inner overflow-hidden">
                    {/* Disc Cover Image */}
                    <img
                        src="/music/disc-cover.jpg"
                        alt="Disc cover"
                        className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover"
                    />

                    {/* CD Shine Effect Overlay */}
                    <div
                        className="absolute inset-1 rounded-full opacity-30 pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.6) 40%, transparent 60%)",
                        }}
                    />

                    {/* CD Center Hole */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg flex items-center justify-center border-2 border-gray-600">
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                        </div>
                    </div>

                    {/* Play/Pause Indicator */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1 drop-shadow-lg" />
                        </div>
                    )}
                </div>

                {/* Glow Effect when playing */}
                {isPlaying && (
                    <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-pulse -z-10" />
                )}
            </button>

            {/* Label */}
            <span className="absolute -top-8 right-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                {isPlaying ? "♪ Playing" : "Click to play"}
            </span>

            <style jsx>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
