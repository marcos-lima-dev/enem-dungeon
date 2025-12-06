"use client"

import { useGame } from "@/context/GameContext"
import { Heart, Trophy, Flame, Zap } from "lucide-react"

export function GameHUD() {
  const { stats } = useGame()

  // Lógica simples de XP: Cada nível precisa de 1000 XP
  const XP_PARA_PROXIMO_NIVEL = 1000
  const xpAtualNoNivel = stats.xp % XP_PARA_PROXIMO_NIVEL
  const porcentagemXp = (xpAtualNoNivel / XP_PARA_PROXIMO_NIVEL) * 100

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="container flex items-center justify-between mx-auto max-w-3xl">
        
        {/* LADO ESQUERDO: Vida (HP) */}
        <div className="flex items-center gap-1">
          {/* Criamos um array baseado no MaxHP para desenhar os corações */}
          {Array.from({ length: stats.maxHp }).map((_, i) => (
            <Heart 
              key={i} 
              className={`w-6 h-6 transition-all ${
                i < stats.hp 
                  ? "fill-red-500 text-red-500 scale-100" // Coração Cheio
                  : "text-gray-300 scale-90"              // Coração Vazio (Dano)
              }`} 
            />
          ))}
        </div>

        {/* CENTRO: Nível e Barra de XP */}
        <div className="flex-1 mx-6 flex flex-col gap-1">
          <div className="flex justify-between text-xs font-bold text-muted-foreground">
            <span>Nível {stats.level}</span>
            <span>{xpAtualNoNivel} / {XP_PARA_PROXIMO_NIVEL} XP</span>
          </div>
          {/* Barra de Progresso Customizada (Tailwind puro) */}
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-500 ease-out"
              style={{ width: `${porcentagemXp}%` }}
            />
          </div>
        </div>

        {/* LADO DIREITO: Combo (Streak) */}
        <div className="flex items-center gap-2">
          {stats.streak > 1 && ( // Só mostra se tiver combo
            <div className="flex items-center gap-1 text-orange-500 animate-pulse font-bold">
              <Flame className="w-5 h-5 fill-orange-500" />
              <span>x{stats.streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-600">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">{stats.xp}</span>
          </div>
        </div>

      </div>
    </header>
  )
}