"use client"

import { Trophy, MapPin, Flame, RotateCcw, Share2 } from "lucide-react"
import type { GameState } from "@/hooks/use-game"

interface GameOverScreenProps {
  gameState: GameState
  onPlayAgain: () => void
}

export function GameOverScreen({
  gameState,
  onPlayAgain,
}: GameOverScreenProps) {
  const movesUsed = 30 - gameState.movesRemaining
  const countriesVisited = gameState.visitedCountries.size
  const maxStreak = Math.max(
    ...gameState.moveHistory.map((m) => m.streak),
    0
  )
  const bestMove = gameState.moveHistory.reduce(
    (best, move) => (move.points > best.points ? move : best),
    { points: 0, fromCountry: "", toCountry: "", language: "", streak: 0 }
  )

  const shareResults = () => {
    const text = `LingoLink ${gameState.hardMode ? "HARD" : "NORMAL"}\n\nScore: ${gameState.score}\nCountries: ${countriesVisited}\nMoves: ${movesUsed}/30\nBest Streak: ${maxStreak}\n\nPlay at lingolink.vercel.app`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Trophy */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Game Over!
          </h1>
          <p className="text-muted-foreground">
            {gameState.hardMode ? "Hard Mode" : "Normal Mode"}
          </p>
        </div>

        {/* Final Score */}
        <div className="bg-card rounded-xl p-8 mb-6 border border-border">
          <p className="text-muted-foreground mb-2">Final Score</p>
          <p className="text-5xl md:text-6xl font-bold text-primary mb-6">
            {gameState.score}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Countries</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {countriesVisited}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground text-sm">
                  Best Streak
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{maxStreak}</p>
            </div>
          </div>
        </div>

        {/* Best Move */}
        {bestMove.points > 0 && (
          <div className="bg-card rounded-xl p-4 mb-6 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Best Move</p>
            <p className="text-foreground">
              <span className="font-medium">{bestMove.fromCountry}</span>
              {" → "}
              <span className="font-medium">{bestMove.toCountry}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              via {bestMove.language} ({bestMove.points} points)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={shareResults}
            className="w-full py-4 px-6 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Copy Results
          </button>
        </div>
      </div>
    </div>
  )
}
