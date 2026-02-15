import { useState, useEffect, useRef, useCallback } from 'react'
import type { Recipe } from '../App'

interface JazzTimerProps {
  recipe: Recipe | null
  onClose: () => void
}

// Jazz chord progressions for generated music
const jazzNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
const chordProgressions = [
  [0, 2, 4], // Major
  [0, 3, 4], // Minor
  [0, 2, 4, 6], // Major 7th
  [0, 3, 4, 6], // Minor 7th
]

export default function JazzTimer({ recipe, onClose }: JazzTimerProps) {
  const [customMinutes, setCustomMinutes] = useState(recipe?.cookTime || 20)
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<number | null>(null)
  const jazzIntervalRef = useRef<number | null>(null)

  const playJazzNote = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Pick random chord progression
    const chord = chordProgressions[Math.floor(Math.random() * chordProgressions.length)]
    const baseNoteIndex = Math.floor(Math.random() * 5)

    chord.forEach((interval, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const filterNode = ctx.createBiquadFilter()

      // Jazz uses different waveforms
      const waveforms: OscillatorType[] = ['sine', 'triangle']
      oscillator.type = waveforms[Math.floor(Math.random() * waveforms.length)]

      const noteIndex = (baseNoteIndex + interval) % jazzNotes.length
      oscillator.frequency.setValueAtTime(jazzNotes[noteIndex], now)

      // Slight detune for warmth
      oscillator.detune.setValueAtTime(Math.random() * 10 - 5, now)

      // Low-pass filter for mellow sound
      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(800 + Math.random() * 400, now)
      filterNode.Q.setValueAtTime(1, now)

      // Soft attack and decay
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2 + i * 0.5)

      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(now + i * 0.05)
      oscillator.stop(now + 3)
    })
  }, [])

  const startJazz = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true)
      playJazzNote()
      jazzIntervalRef.current = window.setInterval(() => {
        playJazzNote()
      }, 3000 + Math.random() * 2000)
    }
  }, [isPlaying, playJazzNote])

  const stopJazz = useCallback(() => {
    setIsPlaying(false)
    if (jazzIntervalRef.current) {
      clearInterval(jazzIntervalRef.current)
      jazzIntervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    if (!hasStarted) {
      setTimeLeft(customMinutes * 60)
      setHasStarted(true)
    }
    setIsRunning(true)
  }, [customMinutes, hasStarted])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setHasStarted(false)
    setTimeLeft(customMinutes * 60)
    stopJazz()
  }, [customMinutes, stopJazz])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      stopJazz()
      // Play completion sound
      if (audioContextRef.current) {
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 1)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, stopJazz])

  useEffect(() => {
    return () => {
      stopJazz()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stopJazz])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const progress = hasStarted ? 1 - (timeLeft / (customMinutes * 60)) : 0
  const circumference = 2 * Math.PI * 120

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-amber-500/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-coral" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-cream/50 hover:text-cream transition-colors z-20"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="relative z-10 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl md:text-3xl">🎷</span>
              <h2 className="font-display text-2xl md:text-3xl text-cream">JAZZ TIMER</h2>
            </div>
            {recipe && (
              <p className="text-amber-500/60 font-serif italic text-sm md:text-base">
                Cooking: {recipe.title}
              </p>
            )}
          </div>

          {/* Timer Display */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              {/* Vinyl record design */}
              <svg width="260" height="260" viewBox="0 0 260 260" className="transform -rotate-90 w-52 h-52 md:w-[260px] md:h-[260px]">
                {/* Outer ring */}
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.1)"
                  strokeWidth="16"
                />
                {/* Progress ring */}
                <circle
                  cx="130"
                  cy="130"
                  r="120"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  className="transition-all duration-1000 ease-linear"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ff6b6b" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`font-mono text-4xl md:text-5xl tracking-wider ${timeLeft === 0 ? 'text-coral animate-pulse' : 'text-cream'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-cream/40 text-xs mt-2 font-mono">
                  {isPlaying ? '♪ JAZZ PLAYING ♪' : 'READY'}
                </div>
              </div>
            </div>
          </div>

          {/* Time Setter (only when not started) */}
          {!hasStarted && (
            <div className="mb-6 md:mb-8">
              <label className="block text-cream/50 font-mono text-xs tracking-wider mb-3 text-center uppercase">
                Set Timer Duration
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCustomMinutes(m => Math.max(1, m - 5))}
                  className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 text-amber-500 font-display text-xl hover:bg-amber-500/30 transition-colors active:scale-95"
                >
                  -
                </button>
                <div className="w-24 text-center">
                  <span className="font-display text-3xl md:text-4xl text-cream">{customMinutes}</span>
                  <span className="text-cream/50 text-sm ml-1">min</span>
                </div>
                <button
                  onClick={() => setCustomMinutes(m => Math.min(50, m + 5))}
                  className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 text-amber-500 font-display text-xl hover:bg-amber-500/30 transition-colors active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="col-span-2 py-4 bg-gradient-to-r from-amber-500 to-orange-600 font-display text-base md:text-lg tracking-wider text-[#0d0d0d] hover:from-amber-400 hover:to-orange-500 transition-all active:scale-[0.98]"
              >
                {hasStarted ? 'RESUME' : 'START COOKING'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="col-span-2 py-4 bg-amber-500/20 border border-amber-500/30 font-display text-base md:text-lg tracking-wider text-amber-500 hover:bg-amber-500/30 transition-all active:scale-[0.98]"
              >
                PAUSE
              </button>
            )}
            <button
              onClick={isPlaying ? stopJazz : startJazz}
              className={`py-3 border font-display tracking-wider transition-all active:scale-[0.98] text-sm md:text-base ${
                isPlaying
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-400'
                  : 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20'
              }`}
            >
              {isPlaying ? '🎵 STOP JAZZ' : '🎷 PLAY JAZZ'}
            </button>
            <button
              onClick={resetTimer}
              className="py-3 bg-cream/5 border border-cream/20 font-display tracking-wider text-cream/60 hover:bg-cream/10 hover:text-cream transition-all active:scale-[0.98] text-sm md:text-base"
            >
              RESET
            </button>
          </div>

          {/* Info */}
          <p className="text-center text-cream/30 text-xs font-serif italic">
            Jazz generated with love by Claude AI. Let the smooth beats guide your cooking.
          </p>
        </div>
      </div>
    </div>
  )
}
