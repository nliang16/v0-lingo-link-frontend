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
  refreshedToCountry: string | null
}

const MAX_MOVES = 30

function getRandomCountry(): string {
  return allCountries[Math.floor(Math.random() * allCountries.length)]
}

function hasViableMovesFromCountry(
  country: string,
  visited: Set<string>,
  langUsage: Record<string, number>,
  maxUses: number
): boolean {
  const langs = countryLanguages[country] || []
  return langs.some((lang) => {
    if ((langUsage[lang] || 0) >= maxUses) return false
    return getCountriesByLanguage(lang).some((c) => !visited.has(c))
  })
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
      refreshedToCountry: null,
    })
    setSelectedLanguage(null)
  }, [])

  const maxLanguageUses = useMemo(() => {
    return gameState?.hardMode ? 4 : 7
  }, [gameState?.hardMode])

  const availableLanguages = useMemo(() => {
    if (!gameState) return []
    const langs = countryLanguages[gameState.currentCountry] || []
    return langs.filter((lang) => {
      if ((gameState.languageUsage[lang] || 0) >= maxLanguageUses) return false
      return getCountriesByLanguage(lang).some(
        (c) => !gameState.visitedCountries.has(c)
      )
    })
  }, [gameState, maxLanguageUses])

  const availableCountries = useMemo(() => {
    if (!selectedLanguage || !gameState) return []
    return getCountriesByLanguage(selectedLanguage).filter(
      (c) => !gameState.visitedCountries.has(c)
    )
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
      const maxUses = gameState.hardMode ? 4 : 7

      let isGameOver = newMovesRemaining === 0
      let finalCountry = country
      let finalLastLanguage: string | null = selectedLanguage
      let finalStreak = newStreak
      let refreshedTo: string | null = null

      if (!isGameOver) {
        const hasValidMove = hasViableMovesFromCountry(
          country,
          newVisited,
          newLanguageUsage,
          maxUses
        )

        if (!hasValidMove) {
          // Port of Java's refreshCountry(): teleport to a random viable unvisited country
          const candidates = allCountries.filter(
            (c) =>
              !newVisited.has(c) &&
              hasViableMovesFromCountry(c, newVisited, newLanguageUsage, maxUses)
          )

          if (candidates.length === 0) {
            isGameOver = true
          } else {
            finalCountry =
              candidates[Math.floor(Math.random() * candidates.length)]
            newVisited.add(finalCountry)
            finalLastLanguage = null
            finalStreak = 0
            refreshedTo = finalCountry
          }
        }
      }

      setGameState({
        ...gameState,
        currentCountry: finalCountry,
        visitedCountries: newVisited,
        score: gameState.score + points,
        streak: finalStreak,
        movesRemaining: newMovesRemaining,
        lastLanguage: finalLastLanguage,
        languageUsage: newLanguageUsage,
        moveHistory: [...gameState.moveHistory, move],
        gameOver: isGameOver,
        refreshedToCountry: refreshedTo,
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
