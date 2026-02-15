import { useState } from 'react'

interface RecipeGeneratorProps {
  onGenerate: () => void
  isGenerating: boolean
}

const cuisineOptions = ['Any', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian']
const timeOptions = ['10-20 min', '20-30 min', '30-40 min', '40-50 min']

export default function RecipeGenerator({ onGenerate, isGenerating }: RecipeGeneratorProps) {
  const [cuisine, setCuisine] = useState('Any')
  const [time, setTime] = useState('20-30 min')

  return (
    <div className="relative">
      {/* Decorative vinyl record */}
      <div className="absolute -right-20 md:-right-10 -top-10 w-32 md:w-48 h-32 md:h-48 opacity-10 pointer-events-none">
        <div className="w-full h-full rounded-full border-4 border-amber-500 relative">
          <div className="absolute inset-4 rounded-full border-2 border-amber-500/50" />
          <div className="absolute inset-8 rounded-full border border-amber-500/30" />
          <div className="absolute inset-[45%] rounded-full bg-amber-500" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-amber-500/20 p-4 md:p-8 relative overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 md:w-16 h-12 md:h-16 border-t-2 border-l-2 border-amber-500/40" />
        <div className="absolute bottom-0 right-0 w-12 md:w-16 h-12 md:h-16 border-b-2 border-r-2 border-amber-500/40" />

        <div className="relative z-10">
          <h2 className="font-display text-xl md:text-2xl text-cream mb-4 md:mb-6 flex items-center gap-3">
            <span className="text-amber-400">///</span> COOK SOMETHING NEW
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Cuisine Selector */}
            <div>
              <label className="block text-cream/50 font-mono text-xs tracking-wider mb-2 uppercase">Cuisine Vibe</label>
              <div className="relative">
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-amber-500/30 text-cream px-4 py-3 font-serif appearance-none cursor-pointer hover:border-amber-500/50 transition-colors focus:outline-none focus:border-amber-500"
                >
                  {cuisineOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Time Selector */}
            <div>
              <label className="block text-cream/50 font-mono text-xs tracking-wider mb-2 uppercase">Time Available</label>
              <div className="relative">
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-amber-500/30 text-cream px-4 py-3 font-serif appearance-none cursor-pointer hover:border-amber-500/50 transition-colors focus:outline-none focus:border-amber-500"
                >
                  {timeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 font-display text-base md:text-lg tracking-wider text-[#0d0d0d] hover:from-amber-400 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isGenerating ? (
                    <>
                      <span className="inline-block animate-spin">🎵</span>
                      COOKING UP...
                    </>
                  ) : (
                    <>
                      <span className="group-hover:rotate-12 transition-transform">🎷</span>
                      GENERATE RECIPE
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Info strip */}
          <div className="flex flex-wrap gap-3 md:gap-4 text-xs text-cream/40 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI-Powered by Grok
            </span>
            <span className="hidden md:inline">•</span>
            <span>Quick recipes only</span>
            <span className="hidden md:inline">•</span>
            <span>10-50 minute meals</span>
          </div>
        </div>
      </div>
    </div>
  )
}
