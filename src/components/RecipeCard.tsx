import { useState } from 'react'
import type { Recipe } from '../App'

interface RecipeCardProps {
  recipe: Recipe
  index: number
  onStartTimer: () => void
}

export default function RecipeCard({ recipe, index, onStartTimer }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const difficultyColors = {
    Easy: 'text-green-400 border-green-400/30 bg-green-400/10',
    Medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    Challenging: 'text-coral border-coral/30 bg-coral/10'
  }

  return (
    <div
      className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-cream/10 hover:border-amber-500/30 transition-all duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Animated border gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-orange-500/20" />
      </div>

      <div className="relative z-10 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg md:text-xl text-cream group-hover:text-amber-400 transition-colors duration-300 leading-tight">
              {recipe.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs md:text-sm">
              <span className="text-cream/60 font-mono">{recipe.cookTime} min</span>
              <span className="text-cream/30">|</span>
              <span className={`px-2 py-0.5 border text-xs font-mono uppercase tracking-wider ${difficultyColors[recipe.difficulty]}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <button
            onClick={onStartTimer}
            className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600/40 hover:scale-110 transition-all duration-300 active:scale-95"
            title="Start Timer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        </div>

        {/* Ingredients Preview */}
        <div className="mb-4">
          <div className="text-amber-500/60 font-mono text-xs tracking-wider uppercase mb-2">Ingredients</div>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {recipe.ingredients.slice(0, 4).map((ing, i) => (
              <span key={i} className="px-2 py-1 bg-cream/5 text-cream/70 text-xs font-serif">
                {ing.split(' ').slice(-1)[0]}
              </span>
            ))}
            {recipe.ingredients.length > 4 && (
              <span className="px-2 py-1 text-cream/40 text-xs">+{recipe.ingredients.length - 4} more</span>
            )}
          </div>
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-amber-500 text-xs font-mono tracking-wider hover:text-amber-400 transition-colors flex items-center gap-2"
        >
          {isExpanded ? '— COLLAPSE' : '+ VIEW FULL RECIPE'}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-cream/10 space-y-6 animate-fadeIn">
            {/* Full Ingredients */}
            <div>
              <div className="text-amber-500/60 font-mono text-xs tracking-wider uppercase mb-3">Full Ingredients</div>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-cream/80 text-sm font-serif flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <div className="text-amber-500/60 font-mono text-xs tracking-wider uppercase mb-3">Instructions</div>
              <ol className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-cream/80 text-sm font-serif flex gap-3">
                    <span className="shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-mono">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Prayer */}
            <div className="relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-l-2 border-blue-500/50 p-4">
              <div className="absolute top-2 right-2 text-2xl opacity-20">🙏</div>
              <div className="text-blue-400/60 font-mono text-xs tracking-wider uppercase mb-2">A Prayer for Your Meal</div>
              <p className="text-cream/70 text-sm font-serif italic leading-relaxed">
                {recipe.prayer}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card number indicator */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 text-cream/10 font-display text-3xl md:text-4xl pointer-events-none">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  )
}
