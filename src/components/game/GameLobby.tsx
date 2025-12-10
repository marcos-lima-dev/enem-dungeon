import Image from "next/image";
import { GameDifficulty } from "@/types/game";
import { Sparkles, Brain, FlaskConical, Hourglass, BookOpen, Swords } from "lucide-react";

interface GameLobbyProps {
  difficulty: GameDifficulty;
  setDifficulty: (diff: GameDifficulty) => void;
  onStartGame: (category: string) => void;
}

export function GameLobby({ difficulty, setDifficulty, onStartGame }: GameLobbyProps) {
  const PORTAIS = [
    { id: 'aleatorio', titulo: 'Abismo do Caos', desc: 'Desafios imprevisíveis.', icon: Sparkles, color: 'text-purple-400', border: 'border-purple-500/50', bgHover: 'group-hover:bg-purple-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
    { id: 'matematica', titulo: 'Torre dos Enigmas', desc: 'Lógica e números.', icon: Brain, color: 'text-blue-400', border: 'border-blue-500/50', bgHover: 'group-hover:bg-blue-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]' },
    { id: 'natureza', titulo: 'Câmara Alquímica', desc: 'Química, Física, Bio.', icon: FlaskConical, color: 'text-green-400', border: 'border-green-500/50', bgHover: 'group-hover:bg-green-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]' },
    { id: 'humanas', titulo: 'Relicários do Tempo', desc: 'História e Sociedade.', icon: Hourglass, color: 'text-amber-400', border: 'border-amber-500/50', bgHover: 'group-hover:bg-amber-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' },
    { id: 'linguagens', titulo: 'Arquivo dos Sábios', desc: 'Artes e Línguas.', icon: BookOpen, color: 'text-red-400', border: 'border-red-500/50', bgHover: 'group-hover:bg-red-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]' },
  ];

  return (
    <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700 mt-6 w-full max-w-4xl px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-48 h-48 group cursor-default transition-transform hover:scale-105 duration-500">
          <div className="absolute inset-0 bg-purple-600/20 blur-[40px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
          <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-xl relative z-10" priority />
        </div>
        <div>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cinzel)] text-stone-200 font-bold tracking-widest uppercase drop-shadow-md">
            <span className="text-amber-600">🔥</span> Escolha seu Portal
          </h2>
        </div>
      </div>

      {/* SELETOR DE DIFICULDADE */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          { id: 'easy', label: 'Aprendiz', color: 'text-green-400', border: 'hover:border-green-500' },
          { id: 'medium', label: 'Aventureiro', color: 'text-blue-400', border: 'hover:border-blue-500' },
          { id: 'hard', label: 'Guardião', color: 'text-red-500', border: 'hover:border-red-500' },
        ].map((nivel) => (
          <button
            key={nivel.id}
            onClick={() => setDifficulty(nivel.id as GameDifficulty)}
            className={`
              relative px-6 py-3 rounded-lg border-2 font-[family-name:var(--font-cinzel)] uppercase tracking-wider transition-all duration-300
              ${difficulty === nivel.id 
                ? `bg-stone-800 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-105` 
                : `bg-stone-900/50 border-stone-700 text-stone-500 ${nivel.border} hover:bg-stone-800`
              }
            `}
          >
            <span className={`text-sm font-bold ${difficulty === nivel.id ? nivel.color : ''}`}>{nivel.label}</span>
          </button>
        ))}
      </div>

      {/* GRID DE PORTAIS */}
      <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2">
        {PORTAIS.slice(0, 4).map((portal) => (
          <button
            key={portal.id}
            onClick={() => onStartGame(portal.id)}
            className={`
              group relative overflow-hidden text-left p-6 rounded-lg border-2 bg-dungeon-stone
              transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]
              ${portal.border} ${portal.glow}
            `}
          >
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${portal.bgHover}`} />
            <div className="relative z-10 flex items-start gap-5">
              <div className={`p-4 rounded-full bg-black/40 border border-white/10 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <portal.icon className={`w-8 h-8 ${portal.color}`} />
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wide mb-1 ${portal.color} drop-shadow-sm`}>{portal.titulo}</h3>
                <p className="text-stone-400 font-[family-name:var(--font-medieval)] text-sm leading-relaxed group-hover:text-stone-200 transition-colors">{portal.desc}</p>
              </div>
              <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"><Swords className={`w-5 h-5 ${portal.color}`} /></div>
            </div>
          </button>
        ))}
        {/* Portal Centralizado (Último) */}
        <div className="md:col-span-2 flex justify-center">
            {PORTAIS.slice(4).map((portal) => (
                <button key={portal.id} onClick={() => onStartGame(portal.id)} className={`group relative overflow-hidden text-left p-6 rounded-lg border-2 bg-dungeon-stone transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] w-full md:w-[calc(50%-0.5rem)] ${portal.border} ${portal.glow}`}>
                     <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${portal.bgHover}`} />
                     <div className="relative z-10 flex items-start gap-5">
                        <div className={`p-4 rounded-full bg-black/40 border border-white/10 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}><portal.icon className={`w-8 h-8 ${portal.color}`} /></div>
                        <div className="flex-1"><h3 className={`text-xl font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wide mb-1 ${portal.color} drop-shadow-sm`}>{portal.titulo}</h3><p className="text-stone-400 font-[family-name:var(--font-medieval)] text-sm leading-relaxed group-hover:text-stone-200 transition-colors">{portal.desc}</p></div>
                     </div>
                </button>
            ))}
        </div>
      </div>
      <div className="text-xs text-stone-700 font-mono mt-12 uppercase tracking-widest opacity-40">v2.0 • Crônicas do Vestibular</div>
    </div>
  );
}