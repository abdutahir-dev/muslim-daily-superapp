import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  User,
  ChevronDown,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { QuranReadingStyle, SurahMeta } from "../../types";
import {
  ReciterProfile,
  getRecitersForReadingStyle,
  getSurahAudioUrl,
  getReadingStyleDetail,
} from "../../lib/qiraatData";

interface QuranAudioPlayerProps {
  surahNumber?: number;
  surahNameEnglish?: string;
  surah?: SurahMeta;
  readingStyle: QuranReadingStyle;
  selectedReciterId?: string;
  onSelectReciter?: (reciterId: string) => void;
  onReadingStyleChange?: (style: QuranReadingStyle) => void;
  onAyahAudioPlayingChange?: (isPlaying: boolean) => void;
}

export const QuranAudioPlayer: React.FC<QuranAudioPlayerProps> = ({
  surahNumber,
  surahNameEnglish,
  surah,
  readingStyle,
  selectedReciterId,
  onSelectReciter,
  onReadingStyleChange,
  onAyahAudioPlayingChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isReciterMenuOpen, setIsReciterMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const targetSurahNum = surahNumber ?? surah?.number ?? 1;

  const availableReciters = getRecitersForReadingStyle(readingStyle);
  const [internalReciterId, setInternalReciterId] = useState(availableReciters[0]?.id || "mishary_alafasy");
  const activeReciterId = selectedReciterId || internalReciterId;
  const currentReciter =
    availableReciters.find((r) => r.id === activeReciterId) ||
    availableReciters[0] || {
      id: "mishary_alafasy",
      nameEnglish: "Mishary Rashid Alafasy",
      nameArabic: "مشاري راشد العفاسي",
      country: "Kuwait",
      style: "hafs_asim" as QuranReadingStyle,
      moshafType: "murattal" as const,
      serverUrl: "https://server8.mp3quran.net/afs/",
    };
  const styleDetail = getReadingStyleDetail(readingStyle);

  const currentAudioUrl = getSurahAudioUrl(currentReciter, targetSurahNum);

  // When surah, readingStyle, or reciter changes, pause and reset
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setErrorMsg(null);
    }
  }, [targetSurahNum, currentReciter.id, readingStyle]);

  useEffect(() => {
    if (onAyahAudioPlayingChange) {
      onAyahAudioPlayingChange(isPlaying);
    }
  }, [isPlaying, onAyahAudioPlayingChange]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio playback issue:", err);
        setErrorMsg("Unable to stream audio. Please check network connection.");
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlaybackRate = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 0.8 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] shadow-lg px-4 py-2.5 transition-all">
      <audio
        ref={audioRef}
        src={currentAudioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setErrorMsg("Audio format unavailable for this reciter.");
          setIsPlaying(false);
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-[10px] text-[#8E8E93]">
          <span className="w-8 text-right font-mono">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-[#E5E5EA] rounded-lg appearance-none cursor-pointer accent-[#007A78]"
          />
          <span className="w-8 font-mono">{formatTime(duration)}</span>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Reciter & Riwayah Info */}
          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsReciterMenuOpen(!isReciterMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-black/[0.04] transition-all text-left max-w-full cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#1C1C1E] truncate">
                    {currentReciter.nameEnglish}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#8E8E93] shrink-0" />
                </div>
                <p className="text-[10px] text-[#007A78] truncate flex items-center gap-1">
                  <span>{styleDetail.nameEnglish}</span>
                  <span className="text-[#8E8E93]">• {currentReciter.country}</span>
                </p>
              </div>
            </button>

            {/* Reciter Dropdown Menu */}
            {isReciterMenuOpen && (
              <div
                className="absolute bottom-full mb-2 left-0 w-72 bg-white rounded-[20px] shadow-2xl border border-black/[0.08] p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 border-b border-black/[0.04] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8E8E93] uppercase">
                    Reciters ({styleDetail.nameEnglish.split(" ")[0]})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsReciterMenuOpen(false)}
                    className="text-xs text-[#8E8E93] hover:text-[#1C1C1E]"
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {availableReciters.map((reciter) => {
                    const isSelected = reciter.id === currentReciter.id;
                    return (
                      <button
                        key={reciter.id}
                        type="button"
                        onClick={() => {
                          setInternalReciterId(reciter.id);
                          if (onSelectReciter) onSelectReciter(reciter.id);
                          setIsReciterMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-[#007A78]/10 text-[#007A78] font-semibold"
                            : "hover:bg-black/[0.04] text-[#1C1C1E]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate">{reciter.nameEnglish}</p>
                          <p className="text-[10px] text-[#8E8E93] font-arabic truncate font-normal">
                            {reciter.nameArabic}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#007A78] shrink-0 ml-1">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Center Play Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                }
              }}
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#8E8E93] active:scale-95 transition-all cursor-pointer"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-[#007A78] hover:bg-[#005c5a] text-white flex items-center justify-center active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={togglePlaybackRate}
              className="px-2 py-1 rounded-full bg-black/[0.05] text-[11px] font-bold text-[#1C1C1E] active:scale-95 cursor-pointer"
              title="Playback speed"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Right Mute & Status */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-[#8E8E93] active:scale-95 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-[10px] text-red-500 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};
