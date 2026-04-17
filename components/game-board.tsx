"use client"

import { MapPin, Languages, ArrowRight, Flame, X } from "lucide-react"
import { getLanguageRarity, countryLanguages } from "@/lib/game-data"
import type { GameState, Move } from "@/hooks/use-game"

interface GameBoardProps {
  gameState: GameState
  selectedLanguage: string | null
  availableLanguages: string[]
  availableCountries: string[]
  maxLanguageUses: number
  onSelectLanguage: (language: string) => void
  onCancelLanguageSelection: () => void
  onSelectCountry: (country: string) => void
}

export function GameBoard({
  gameState,
  selectedLanguage,
  availableLanguages,
  availableCountries,
  maxLanguageUses,
  onSelectLanguage,
  onCancelLanguageSelection,
  onSelectCountry,
}: GameBoardProps) {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-1">Score</p>
          <p className="text-2xl md:text-3xl font-bold text-primary">
            {gameState.score}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-1">Streak</p>
          <div className="flex items-center justify-center gap-1">
            <Flame
              className={`w-5 h-5 ${gameState.streak > 0 ? "text-accent" : "text-muted-foreground"}`}
            />
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {gameState.streak}
            </p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-1">Moves</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {gameState.movesRemaining}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-3 gap-6">
        {/* Current Country & Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Country */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Current Location
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {gameState.currentCountry}
                </h2>
              </div>
            </div>

            {gameState.lastLanguage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Last language:</span>
                <span className="px-2 py-1 bg-accent/10 text-accent rounded-md font-medium">
                  {gameState.lastLanguage}
                </span>
                {gameState.streak > 0 && (
                  <span className="text-accent">
                    (Streak x{gameState.streak})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Language or Country Selection */}
          {!selectedLanguage ? (
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Languages className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">
                  Choose a Language
                </h3>
              </div>

              {availableLanguages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableLanguages.map((language) => {
                    const rarity = getLanguageRarity(language)
                    const usage = gameState.languageUsage[language] || 0
                    const isSameAsLast = language === gameState.lastLanguage
                    const potentialStreak = isSameAsLast
                      ? gameState.streak + 1
                      : 1
                    const potentialPoints = rarity * potentialStreak

                    return (
                      <button
                        key={language}
                        onClick={() => onSelectLanguage(language)}
                        className={`p-4 rounded-xl border text-left transition-all hover:border-primary/50 hover:bg-primary/5 ${
                          isSameAsLast
                            ? "border-accent/50 bg-accent/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">
                            {language}
                          </span>
                          {isSameAsLast && (
                            <Flame className="w-4 h-4 text-accent" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Rarity: {rarity}
                          </span>
                          <span className="text-primary font-medium">
                            +{potentialPoints} pts
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Uses: {usage}/{maxLanguageUses}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No available languages - game over!
                </p>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Travel to{" "}
                    <span className="text-primary">{selectedLanguage}</span>
                    -speaking country
                  </h3>
                </div>
                <button
                  onClick={onCancelLanguageSelection}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {availableCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => onSelectCountry(country)}
                    className="p-4 rounded-xl border border-border text-left transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span className="font-medium text-foreground">
                      {country}
                    </span>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {countryLanguages[country]?.length || 0} languages
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Move History */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl p-6 border border-border h-full max-h-[600px] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Move History
            </h3>

            {gameState.moveHistory.length > 0 ? (
              <div className="space-y-3 overflow-y-auto flex-1">
                {gameState.moveHistory
                  .slice()
                  .reverse()
                  .map((move, idx) => (
                    <MoveHistoryItem
                      key={gameState.moveHistory.length - 1 - idx}
                      move={move}
                      moveNumber={gameState.moveHistory.length - idx}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No moves yet. Start by picking a language!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MoveHistoryItem({
  move,
  moveNumber,
}: {
  move: Move
  moveNumber: number
}) {
  return (
    <div className="p-3 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Move {moveNumber}</span>
        <div className="flex items-center gap-1">
          {move.streak > 1 && (
            <span className="flex items-center gap-1 text-xs text-accent">
              <Flame className="w-3 h-3" />
              x{move.streak}
            </span>
          )}
          <span className="text-sm font-semibold text-primary">
            +{move.points}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-foreground truncate">{move.fromCountry}</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="text-foreground truncate">{move.toCountry}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        via {move.language}
      </div>
    </div>
  )
}
