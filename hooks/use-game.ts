"use client"

import { useState, useCallback, useMemo } from "react"
import {
  countryLanguages,
  allCountries,
  getCountriesByLanguage,
  getLanguageRarity,
} from "@/lib/game-data"

export interface Move {
  fromCountry: string
  toCountry: string
  language: string
  points: number
  streak: number
}

export interface GameState {
  currentCountry: string
  visitedCountries: Set<string>
  score: number
  streak: number
  movesRemaining: number
  lastLanguage: string | null
  languageUsage: Record<string, number>
  moveHistory: Move[]
  gameOver: boolean
  hardMode: boolean
}

const MAX_MOVES = 30

function getRandomCountry(): string {
  const randomIndex = Math.floor(Math.random() * allCountries.length)
  return allCountries[randomIndex]
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  const startGame = useCallback((hardMode: boolean) => {
    const startingCountry = getRandomCountry()
    setGameState({
      currentCountry: startingCountry,
      visitedCountries: new Set([startingCountry]),
      score: 0,
      streak: 0,
      movesRemaining: MAX_MOVES,
      lastLanguage: null,
      languageUsage: {},
      moveHistory: [],
      gameOver: false,
      hardMode,
    })
    setSelectedLanguage(null)
  }, [])

  const maxLanguageUses = useMemo(() => {
    return gameState?.hardMode ? 4 : 7
  }, [gameState?.hardMode])

  const availableLanguages = useMemo(() => {
    if (!gameState) return []
    const languages = countryLanguages[gameState.currentCountry] || []
    return languages.filter((lang) => {
      const usage = gameState.languageUsage[lang] || 0
      if (usage >= maxLanguageUses) return false
      // Check if there are any unvisited countries for this language
      const countries = getCountriesByLanguage(lang)
      return countries.some((c) => !gameState.visitedCountries.has(c))
    })
  }, [gameState, maxLanguageUses])

  const availableCountries = useMemo(() => {
    if (!selectedLanguage || !gameState) return []
    const countries = getCountriesByLanguage(selectedLanguage)
    return countries.filter((c) => !gameState.visitedCountries.has(c))
  }, [selectedLanguage, gameState])

  const selectLanguage = useCallback((language: string) => {
    setSelectedLanguage(language)
  }, [])

  const cancelLanguageSelection = useCallback(() => {
    setSelectedLanguage(null)
  }, [])

  const selectCountry = useCallback(
    (country: string) => {
      if (!gameState || !selectedLanguage) return

      const isSameLanguage = selectedLanguage === gameState.lastLanguage
      const newStreak = isSameLanguage ? gameState.streak + 1 : 1
      const rarity = getLanguageRarity(selectedLanguage)
      const points = rarity * newStreak

      const move: Move = {
        fromCountry: gameState.currentCountry,
        toCountry: country,
        language: selectedLanguage,
        points,
        streak: newStreak,
      }

      const newVisited = new Set(gameState.visitedCountries)
      newVisited.add(country)

      const newLanguageUsage = { ...gameState.languageUsage }
      newLanguageUsage[selectedLanguage] =
        (newLanguageUsage[selectedLanguage] || 0) + 1

      const newMovesRemaining = gameState.movesRemaining - 1

      // Check if game is over
      let isGameOver = newMovesRemaining === 0

      // Check if no valid moves remain
      if (!isGameOver) {
        const languagesInNewCountry = countryLanguages[country] || []
        const maxUses = gameState.hardMode ? 4 : 7
        const hasValidMove = languagesInNewCountry.some((lang) => {
          const usage = newLanguageUsage[lang] || 0
          if (usage >= maxUses) return false
          const countries = getCountriesByLanguage(lang)
          return countries.some((c) => !newVisited.has(c))
        })
        if (!hasValidMove) {
          isGameOver = true
        }
      }

      setGameState({
        ...gameState,
        currentCountry: country,
        visitedCountries: newVisited,
        score: gameState.score + points,
        streak: newStreak,
        movesRemaining: newMovesRemaining,
        lastLanguage: selectedLanguage,
        languageUsage: newLanguageUsage,
        moveHistory: [...gameState.moveHistory, move],
        gameOver: isGameOver,
      })

      setSelectedLanguage(null)
    },
    [gameState, selectedLanguage]
  )

  const resetGame = useCallback(() => {
    setGameState(null)
    setSelectedLanguage(null)
  }, [])

  return {
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
  }
}
