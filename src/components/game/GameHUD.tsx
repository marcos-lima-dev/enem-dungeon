import { Heart, Trophy, Book, Home as HomeIcon } from "lucide-react";

interface GameHUDProps {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  onExit: () => void;
  onOpenGrimoire: () => void;
}

export function GameHUD({ hp, maxHp, xp, level, onExit, onOpenGrimoire }: GameHUDProps) {
  return (
    <div className="w-full max-w-5xl flex justify-between items-center bg-[#151412] p-3 border-y-4 border-amber-900/40 backdrop-blur sticky top-0 z-50 shadow-2xl">
      <div className="flex items-center gap-3">
        {/* BOTÃO SAIR */}
        <button
          onClick={onExit}
          className="group w-10 h-10 flex items-center justify-center rounded-full bg-[#0c0a09] border border-stone-600 hover:border-red-500 hover:bg-red-900/20 transition-all shadow-lg"
          title="Sair da Masmorra"
        >
          <HomeIcon className="w-4 h-4 text-stone-400 group-hover:text-red-400 transition-colors" />
        </button>

        {/* BOTÃO GRIMÓRIO (PULSANTE) */}
        <button
          onClick={onOpenGrimoire}
          className="relative group w-10 h-10 flex items-center justify-center rounded-full bg-[#0c0a09] border-2 border-amber-500 shadow-amber-900/50 hover:scale-110 transition-all duration-300"
          title="Ver Histórico"
        >
          <div className="absolute inset-0 rounded-full bg-amber-600/40 blur-md animate-pulse" />
          <Book className="w-4 h-4 text-amber-500 group-hover:text-amber-200 transition-colors relative z-10" />
        </button>

        <div className="h-8 w-px bg-stone-700 mx-1" />

        {/* VIDA DINÂMICA */}
        <div className="flex bg-black/50 p-2 rounded border border-stone-800 gap-1">
          {Array.from({ length: maxHp }).map((_, i) => (
            <Heart
              key={i}
              className={`h-5 w-5 transition-all duration-300 drop-shadow-md ${
                i < hp
                  ? "fill-red-700 text-red-900 scale-100"
                  : "fill-stone-900 text-stone-800 scale-90 opacity-50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end w-full max-w-xs">
        <div className="flex items-center gap-3 text-amber-500 font-bold mb-1 font-[family-name:var(--font-cinzel)]">
          <span className="text-xl drop-shadow-sm text-shadow">{xp} XP</span>
          <Trophy className="h-5 w-5 text-amber-600" />
        </div>
        <div className="w-full h-2 bg-black border border-stone-600 relative rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-800 to-amber-600 transition-all duration-500"
            style={{ width: `${(xp % (level * 50)) * 2}%` }}
          />
        </div>
        <span className="text-[10px] text-stone-500 uppercase font-bold mt-1 tracking-widest font-mono">
          Nível {level}
        </span>
      </div>
    </div>
  );
}