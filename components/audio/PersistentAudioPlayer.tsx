"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAudio } from "@/lib/audio/AudioContext";
import { useI18n } from "@/lib/i18n/context";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronDown,
  ChevronUp,
  X,
  Music,
} from "lucide-react";

export const PersistentAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    nextTrack,
    prevTrack,
    closePlayer,
    playlist,
    playTrack,
    isPlayerOpen,
  } = useAudio();

  const { language, t } = useI18n();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isPlayerOpen || !currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up transition-all">
      {/* Playlist Drawer */}
      {showPlaylist && (
        <div className="max-w-4xl mx-auto mb-2 px-4">
          <div className="bg-spiritual-navy/95 border border-gold-500/40 rounded-2xl p-4 backdrop-blur-2xl shadow-2xl max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-gold-500/20 mb-3">
              <span className="text-sm font-bold text-gold-300 flex items-center gap-2">
                <ListMusic className="w-4 h-4" />
                {t("audio.playlist", "प्लेलिस्ट")} ({playlist.length})
              </span>
              <button
                onClick={() => setShowPlaylist(false)}
                className="text-spiritual-ivory/60 hover:text-gold-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {playlist.map((track, idx) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-gold-500/20 text-gold-300 font-bold border border-gold-400/40"
                        : "text-spiritual-ivory/80 hover:bg-gold-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-[11px] opacity-60 w-4 text-center">{idx + 1}</span>
                      <span className="truncate">
                        {language === "hi" ? track.titleHi : track.titleEn}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-60 ml-2">{track.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Player Bar */}
      <div className="bg-spiritual-navy/95 border-t border-gold-500/40 backdrop-blur-2xl px-4 py-2.5 shadow-2xl shadow-black/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-gold-400/40 flex-shrink-0 bg-black">
              <Image
                src={currentTrack.coverUrl || "/assets/logo-emblem.png"}
                alt="Cover"
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm font-bold text-gold-200 truncate">
                {language === "hi" ? currentTrack.titleHi : currentTrack.titleEn}
              </div>
              <div className="text-[10px] sm:text-xs text-spiritual-ivory/60 truncate">
                {currentTrack.speaker || t("audio.nowPlaying", "अब बज रहा है")}
              </div>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="flex flex-col items-center w-full md:w-1/2 max-w-xl">
            {/* Buttons */}
            <div className="flex items-center gap-4 mb-1">
              <button
                onClick={prevTrack}
                className="p-1.5 text-spiritual-ivory/70 hover:text-gold-300 transition-colors"
                aria-label="Previous Track"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-gold-gradient text-spiritual-dark flex items-center justify-center shadow-gold-sm hover:scale-105 transition-transform"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-1.5 text-spiritual-ivory/70 hover:text-gold-300 transition-colors"
                aria-label="Next Track"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber */}
            <div className="w-full flex items-center gap-2">
              <span className="text-[10px] text-spiritual-ivory/60 font-mono w-8 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                className="w-full h-1 bg-gold-950/60 rounded-lg appearance-none cursor-pointer accent-gold-400"
              />
              <span className="text-[10px] text-spiritual-ivory/60 font-mono w-8">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Actions: Volume & Playlist */}
          <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.85)}
                className="text-spiritual-ivory/70 hover:text-gold-300"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gold-950/60 rounded-lg appearance-none cursor-pointer accent-gold-400"
              />
            </div>

            {/* Playlist Toggle */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-1.5 rounded-lg border transition-colors ${
                showPlaylist
                  ? "bg-gold-500/20 text-gold-300 border-gold-400/50"
                  : "text-spiritual-ivory/70 border-gold-500/20 hover:text-gold-300"
              }`}
              title={t("audio.playlist", "प्लेलिस्ट")}
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={closePlayer}
              className="p-1.5 text-spiritual-ivory/50 hover:text-red-400 transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
