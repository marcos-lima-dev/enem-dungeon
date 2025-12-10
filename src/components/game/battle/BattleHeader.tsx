import { Monster } from "@/types/game";
import { Swords, Skull, Flame } from "lucide-react";

interface BattleHeaderProps {
  monster: Monster;
}

export function BattleHeader({ monster }: BattleHeaderProps) {
  const RUNES = "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ";

  return (
    <div className="relative bg-black/40 border-b-4 border-[#1c1917] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Runas decorativas */}
      <div className="absolute top-1 left-0 w-full text-center text-[10px] text-rune-glow opacity-30 font-mono tracking-[1.5em] select-none pointer-events-none">
        {RUNES}
      </div>

      <div className="flex items-center gap-4 z-10 w-full">
        {/* Ícone do Monstro */}
        <div className={`
          w-16 h-16 flex-shrink-0 flex items-center justify-center border-4 rotate-45 shadow-2xl 
          ${monster.difficulty === 'boss' ? 'bg-red-950 border-red-800' : 'bg-stone-800 border-stone-600'}
        `}>
          <div className="-rotate-45 filter drop-shadow-lg">
             {monster.difficulty === 'boss' ? <Skull className="h-8 w-8 text-red-500 animate-pulse" /> : <Swords className="h-8 w-8 text-slate-400" />}
          </div>
        </div>

        {/* Nome e Categoria */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-cinzel)]">
            <Flame className="w-3 h-3 fill-current" />
            {monster.category}
            <span className="text-stone-600">|</span>
            <span className={monster.difficulty === 'boss' ? "text-red-500" : "text-stone-400"}>
              {monster.difficulty.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl text-stone-100 font-[family-name:var(--font-cinzel)] font-black text-shadow-lg leading-none mt-1">
            {monster.name}
          </h1>
        </div>
      </div>

      {/* Barra de HP do Inimigo */}
      <div className="w-full md:w-48 z-10">
        <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase mb-1">
          <span>HP Inimigo</span>
          <span>{monster.hp}/{monster.maxHp}</span>
        </div>
        <div className="h-3 bg-black border border-stone-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-900 to-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
            style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}