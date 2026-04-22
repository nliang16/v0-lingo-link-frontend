"use client"

import { useState } from "react"
import { Globe, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface StartScreenProps {
  onStart: (hardMode: boolean) => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [hardMode, setHardMode] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Globe className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            LingoLink
          </h1>
          <p className="text-muted-foreground text-lg">
            Are you truly worldly? Challenge your knowledge by connecting countries through shared languages!
          </p>
        </div>

        {/* How to Play */}
        <div className="bg-card rounded-xl p-6 mb-8 border border-border text-left shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            How to Play
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                1
              </span>
              <span>Pick a language spoken in your current country</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                2
              </span>
              <span>Travel to another country that speaks that language</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                3
              </span>
              <span>Build streaks by using the same language repeatedly</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                4
              </span>
              <span>Rarer languages score more points</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                5
              </span>
              <span>Try to score as many points as possible in 30 moves</span>
            </li>
          </ul>
        </div>

        {/* Hard Mode Toggle */}
        <div className="bg-card rounded-xl p-4 mb-8 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Hard Mode</p>
                <p className="text-sm text-muted-foreground">
                  {hardMode
                    ? "Languages: 4 uses max"
                    : "Languages: 7 uses max"}
                </p>
              </div>
            </div>
            <Switch checked={hardMode} onCheckedChange={setHardMode} />
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(hardMode)}
          className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
