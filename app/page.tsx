"use client"

import { useGame } from "@/hooks/use-game"
import { StartScreen } from "@/components/start-screen"
import { GameBoard } from "@/components/game-board"
import { GameOverScreen } from "@/components/game-over-screen"

export default function LingoLinkPage() {
  const {
    gameState,
    selectedLanguage,
    availableLanguages,
    availableCountries,
    maxLanguageUses,
    startGame,
    selectLanguage,
    cancelLanguageSelection,
    selectCountry,
    resetGame,
  } = useGame()

  // Start Screen
  if (!gameState) {
    return <StartScreen onStart={startGame} />
  }

  // Game Over Screen
  if (gameState.gameOver) {
    return <GameOverScreen gameState={gameState} onPlayAgain={resetGame} />
  }

  // Game Board
  return (
    <GameBoard
      gameState={gameState}
      selectedLanguage={selectedLanguage}
      availableLanguages={availableLanguages}
      availableCountries={availableCountries}
      maxLanguageUses={maxLanguageUses}
      onSelectLanguage={selectLanguage}
      onCancelLanguageSelection={cancelLanguageSelection}
      onSelectCountry={selectCountry}
    />
  )
}
