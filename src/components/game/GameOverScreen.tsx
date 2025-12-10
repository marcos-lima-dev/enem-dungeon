import { Skull } from "lucide-react";

interface GameOverScreenProps {
  level: number;
  xp: number;
  onRestart: () => void;
}

export function GameOverScreen({ level, xp, onRestart }: GameOverScreenProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-red-950/20 text-slate-100 animate-in fade-in duration-1000 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      <div className="text-center space-y-8 bg-black/90 p-12 rounded-lg border-[6px] border-double border-red-900 shadow-[0_0_80px_rgba(220,38,38,0.6)]">
        <Skull className="w-40 h-40 text-red-600 mx-auto animate-pulse drop-shadow-lg" />
        <h1 className="text-6xl font-[family-name:var(--font-cinzel)] text-red-500 font-black tracking-widest text-shadow-sm">
          FIM DE JOGO
        </h1>
        <div className="space-y-2 font-[family-name:var(--font-medieval)] text-2xl">
          <p className="text-stone-400">
            Sua jornada terminou no <strong className="text-white">Nível {level}</strong>.
          </p>
          <p className="text-amber-600">XP Final: {xp}</p>
        </div>
        <button
          onClick={onRestart}
          className="btn-rpg-stone px-12 py-4 w-full text-xl font-bold rounded mt-8 text-red-200 border-red-900 hover:text-white uppercase tracking-widest font-[family-name:var(--font-cinzel)]"
        >
          Renascer das Cinzas
        </button>
      </div>
    </main>
  );
}