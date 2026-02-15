import { useState, useEffect, useRef, useCallback } from 'react'
import RecipeGenerator from './components/RecipeGenerator'
import JazzTimer from './components/JazzTimer'
import RecipeCard from './components/RecipeCard'

export interface Recipe {
  id: string
  title: string
  cookTime: number
  ingredients: string[]
  instructions: string[]
  prayer: string
  difficulty: 'Easy' | 'Medium' | 'Challenging'
}

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Smoky Honey Garlic Chicken',
    cookTime: 25,
    ingredients: ['4 chicken thighs', '3 tbsp honey', '4 cloves garlic', '2 tbsp soy sauce', '1 tsp smoked paprika', 'Fresh thyme'],
    instructions: [
      'Preheat oven to 400°F (200°C)',
      'Mix honey, minced garlic, soy sauce, and paprika in a bowl',
      'Place chicken in baking dish, pour sauce over',
      'Bake for 25 minutes until golden and cooked through',
      'Garnish with fresh thyme and serve hot'
    ],
    prayer: 'May this meal nourish your body and warm your soul. Be grateful for the hands that grew this food and the earth that provided it.',
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'Crispy Ginger Tofu Stir-Fry',
    cookTime: 20,
    ingredients: ['1 block firm tofu', '2 cups mixed vegetables', '3 tbsp soy sauce', '1 tbsp sesame oil', '2 inch fresh ginger', 'Rice for serving'],
    instructions: [
      'Press tofu and cut into cubes, let dry',
      'Heat sesame oil in a hot wok or large pan',
      'Fry tofu until crispy on all sides, about 8 minutes',
      'Add vegetables and grated ginger, stir-fry 5 minutes',
      'Add soy sauce, toss well, serve over rice'
    ],
    prayer: 'With each bite, remember the journey from seed to plate. May gratitude fill your heart as this food fills your belly.',
    difficulty: 'Easy'
  },
  {
    id: '3',
    title: 'Mediterranean Lamb Pita Pockets',
    cookTime: 35,
    ingredients: ['500g ground lamb', '1 red onion', 'Fresh mint', 'Greek yogurt', 'Cucumber', 'Pita bread', 'Za\'atar spice'],
    instructions: [
      'Season lamb with za\'atar, salt, and pepper',
      'Form into small patties and grill 4-5 minutes per side',
      'Dice cucumber, slice onion, chop fresh mint',
      'Make sauce: yogurt + mint + pinch of salt',
      'Warm pitas, stuff with lamb, veggies, and sauce'
    ],
    prayer: 'From the mountains to your table, this lamb brings sustenance. Eat mindfully, share generously, and give thanks for abundance.',
    difficulty: 'Medium'
  },
  {
    id: '4',
    title: 'Spicy Shrimp Tacos',
    cookTime: 15,
    ingredients: ['1 lb shrimp', 'Chipotle peppers', 'Lime', 'Cilantro', 'Cabbage slaw', 'Corn tortillas', 'Avocado'],
    instructions: [
      'Marinate shrimp in chipotle, lime juice, and garlic',
      'Sear shrimp in hot pan, 2 minutes per side',
      'Prepare cabbage slaw with lime and cilantro',
      'Warm tortillas on open flame or dry pan',
      'Assemble tacos with shrimp, slaw, and avocado slices'
    ],
    prayer: 'The sea provides, the earth gives, and your hands create. May this meal remind you of life\'s beautiful interconnection.',
    difficulty: 'Easy'
  },
  {
    id: '5',
    title: 'Mushroom Risotto',
    cookTime: 45,
    ingredients: ['1.5 cups arborio rice', '6 cups warm stock', '200g mixed mushrooms', 'White wine', 'Parmesan', 'Shallots', 'Butter'],
    instructions: [
      'Sauté mushrooms until golden, set aside',
      'Cook shallots in butter until soft',
      'Add rice, toast 2 minutes, add wine',
      'Add stock one ladle at a time, stirring constantly',
      'Fold in mushrooms, parmesan, and butter to finish'
    ],
    prayer: 'Patience creates perfection. As you stirred this risotto with care, may you approach all of life\'s tasks with the same devotion.',
    difficulty: 'Challenging'
  }
]

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null)
  const [showTimer, setShowTimer] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const generateRecipe = useCallback(() => {
    setIsGenerating(true)
    // Simulate API call - in production this would call Grok API
    setTimeout(() => {
      const randomRecipe = sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)]
      const newRecipe = { ...randomRecipe, id: Date.now().toString() }
      setRecipes(prev => [newRecipe, ...prev])
      setActiveRecipe(newRecipe)
      setIsGenerating(false)
    }, 1500)
  }, [])

  const startTimer = useCallback((recipe: Recipe) => {
    setActiveRecipe(recipe)
    setShowTimer(true)
  }, [])

  useEffect(() => {
    // Generate initial recipe on load
    generateRecipe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0d0d0d] relative overflow-x-hidden">
      {/* Animated grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-4 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                  <span className="text-base md:text-lg">🎷</span>
                </div>
                <span className="text-amber-500/60 font-mono text-xs tracking-[0.3em] uppercase">Quick Bites</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream tracking-tight leading-none">
                SOULFUL<br className="md:hidden" /><span className="text-amber-400">KITCHEN</span>
              </h1>
              <p className="text-cream/50 mt-2 md:mt-3 max-w-md text-sm md:text-base font-serif italic">
                Recipes that slap, cooked in 10-50 minutes. Let the jazz guide your cooking journey.
              </p>
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={() => setShowTimer(true)}
                className="px-4 md:px-6 py-3 md:py-4 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-display text-sm md:text-base tracking-wider hover:bg-blue-600/30 transition-all duration-300 active:scale-95"
              >
                JAZZ TIMER
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Recipe Generator */}
          <RecipeGenerator onGenerate={generateRecipe} isGenerating={isGenerating} />

          {/* Recipe Grid */}
          <div className="mt-8 md:mt-12">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <span className="text-amber-500/60 font-mono text-xs tracking-[0.2em] uppercase">Your Recipes</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            {recipes.length === 0 && !isGenerating ? (
              <div className="text-center py-16 md:py-20">
                <div className="text-6xl md:text-8xl mb-4 opacity-20">🍳</div>
                <p className="text-cream/40 font-serif italic">Generate your first recipe to get cooking...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {recipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={index}
                    onStartTimer={() => startTimer(recipe)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 md:pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-cream/30 text-xs font-serif">
            Requested by <span className="text-amber-500/50">@stringer_kade</span> · Built by <span className="text-blue-400/50">@clonkbot</span>
          </p>
        </div>
      </footer>

      {/* Jazz Timer Modal */}
      {showTimer && (
        <JazzTimer
          recipe={activeRecipe}
          onClose={() => setShowTimer(false)}
        />
      )}
    </div>
  )
}

export default App
