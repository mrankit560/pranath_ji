"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { AudioTrack } from "../data/types";
import { store } from "../data/store";

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playlist: AudioTrack[];
  currentTime: number;
  duration: number;
  volume: number;
  isPlayerOpen: boolean;
  playTrack: (track: AudioTrack, customPlaylist?: AudioTrack[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  closePlayer: () => void;
  setPlaylist: (playlist: AudioTrack[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize default playlist from store
    const initialTracks = store.getAudioTracks();
    setPlaylist(initialTracks);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener("loadedmetadata", () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || 0);
        }
      });

      audioRef.current.addEventListener("ended", () => {
        handleNextTrack();
      });

      audioRef.current.addEventListener("play", () => setIsPlaying(true));
      audioRef.current.addEventListener("pause", () => setIsPlaying(false));
    }
  }, []);

  const playTrack = (track: AudioTrack, customPlaylist?: AudioTrack[]) => {
    if (customPlaylist && customPlaylist.length > 0) {
      setPlaylist(customPlaylist);
    }
    setCurrentTrack(track);
    setIsPlayerOpen(true);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn("Audio playback error:", e);
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.warn);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const handleNextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsPlayerOpen(false);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist,
        currentTime,
        duration,
        volume,
        isPlayerOpen,
        playTrack,
        togglePlay,
        seek,
        setVolume,
        nextTrack: handleNextTrack,
        prevTrack: handlePrevTrack,
        closePlayer,
        setPlaylist,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
