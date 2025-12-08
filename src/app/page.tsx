"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createMonsterFromQuestion } from "@/lib/monster-factory";
import { useGameStore } from "@/store/use-game-store";
import { QuestaoLimpa, Monster, GameDifficulty } from "@/types/game";
import { BattleCard } from "@/components/game/BattleCard";
import { LevelUpModal } from "@/components/game/LevelUpModal";
import { GrimoireModal } from "@/components/game/GrimoireModal"; 
import { useGameSound } from "@/hooks/use-game-sound";
import { toast } from "sonner";
import { 
  Loader2, Heart, Trophy, Skull, Brain, 
  FlaskConical, Hourglass, BookOpen, Sparkles, Swords, Book,
  Home as HomeIcon
} from "lucide-react";

export default function Home() {
  const { hp, maxHp, xp, level, takeDamage, addXp, resetGame, difficulty, setDifficulty, addToHistory } = useGameStore();
  
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Monster | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('aleatorio');

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showGrimoire, setShowGrimoire] = useState(false);
  
  const prevLevelRef = useRef(level);
  const { playGameOver, playWin, playHit } = useGameSound();

  // --- 🎨 SISTEMA DE TEMAS (Visual Dinâmico) ---
  const THEME = {
    easy: {
      color: "text-emerald-400",
      border: "border-emerald-600",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
      badge: "APRENDIZ",
      iconColor: "text-emerald-500"
    },
    medium: {
      color: "text-amber-400",
      border: "border-amber-600",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      badge: "AVENTUREIRO",
      iconColor: "text-amber-500"
    },
    hard: {
      color: "text-red-500",
      border: "border-red-800",
      glow: "shadow-[0_0_30px_rgba(220,38,38,0.5)]", // Glow mais forte no hard
      badge: "GUARDIÃO",
      iconColor: "text-red-600"
    }
  };

  const currentTheme = THEME[difficulty];

  const PORTAIS = [
    { id: 'aleatorio', titulo: 'Abismo do Caos', desc: 'Desafios imprevisíveis.', icon: Sparkles, color: 'text-purple-400', border: 'border-purple-500/50', bgHover: 'group-hover:bg-purple-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
    { id: 'matematica', titulo: 'Torre dos Enigmas', desc: 'Raciocínio lógico e números.', icon: Brain, color: 'text-blue-400', border: 'border-blue-500/50', bgHover: 'group-hover:bg-blue-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]' },
    { id: 'natureza', titulo: 'Câmara Alquímica', desc: 'Química, Física e Biologia.', icon: FlaskConical, color: 'text-green-400', border: 'border-green-500/50', bgHover: 'group-hover:bg-green-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]' },
    { id: 'humanas', titulo: 'Relicários do Tempo', desc: 'História e Sociedade.', icon: Hourglass, color: 'text-amber-400', border: 'border-amber-500/50', bgHover: 'group-hover:bg-amber-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' },
    { id: 'linguagens', titulo: 'Arquivo dos Sábios', desc: 'Línguas e Interpretação.', icon: BookOpen, color: 'text-red-400', border: 'border-red-500/50', bgHover: 'group-hover:bg-red-900/20', glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]' },
  ];

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp(true);
      playWin();
      if (!question) fetchNewMonster(selectedCategory);
    }
    prevLevelRef.current = level;
  }, [level, playWin]); 

  useEffect(() => {
    if (hp <= 0 && !isGameOver) {
      setIsGameOver(true);
      setQuestion(null);
      playGameOver();
      toast.error("VOCÊ FOI DERROTADO!");
    }
  }, [hp, isGameOver, playGameOver]);

  async function fetchNewMonster(categoria: string = selectedCategory) {
    if (hp <= 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/monster?t=${Date.now()}&categoria=${categoria}`);
      if (!res.ok) throw new Error("Falha na comunicação");
      const data = await res.json();
      if (!data || !Array.isArray(data) || data.length === 0) throw new Error("Masmorra vazia");
      const monster = createMonsterFromQuestion(data[0] as QuestaoLimpa);
      setQuestion(monster);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao invocar monstro.");
    } finally {
      setLoading(false);
    }
  }

  const startGame = (categoria: string) => {
    setSelectedCategory(categoria);
    fetchNewMonster(categoria);
  };

  const handleExit = () => {
    setQuestion(null); 
    setLoading(false); 
  };

  const handleAttack = async (isCorrect: boolean) => {
    if (question) {
      addToHistory({
        questionId: question.id,
        category: question.category,
        isCorrect: isCorrect
      });
    }

    if (isCorrect) {
      toast.success("CRÍTICO! Inimigo derrotado!");
      addXp(50);
    } else {
      toast.error("DANO SOFRIDO! -1 Coração");
      takeDamage(1);
    }

    setTimeout(() => { 
      fetchNewMonster(selectedCategory); 
    }, 2500);
  };

  const handleRestart = () => {
    resetGame();
    setIsGameOver(false);
    setQuestion(null);
    prevLevelRef.current = 1;
  };

  const handleOpenGrimoire = () => {
    playHit();
    setShowGrimoire(true);
  };

  if (isGameOver) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-red-950/20 text-slate-100 animate-in fade-in duration-1000 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <div className="text-center space-y-8 bg-black/90 p-12 rounded-lg border-[6px] border-double border-red-900 shadow-[0_0_80px_rgba(220,38,38,0.6)]">
          <Skull className="w-40 h-40 text-red-600 mx-auto animate-pulse drop-shadow-lg" />
          <h1 className="text-6xl font-[family-name:var(--font-cinzel)] text-red-500 font-black tracking-widest text-shadow-sm">FIM DE JOGO</h1>
          <div className="space-y-2 font-[family-name:var(--font-medieval)] text-2xl">
            <p className="text-stone-400">Sua jornada terminou no <strong className="text-white">Nível {level}</strong>.</p>
            <p className="text-amber-600">XP Final: {xp}</p>
          </div>
          <button onClick={handleRestart} className="btn-rpg-stone px-12 py-4 w-full text-xl font-bold rounded mt-8 text-red-200 border-red-900 hover:text-white uppercase tracking-widest font-[family-name:var(--font-cinzel)]">
            Renascer das Cinzas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 gap-6 bg-slate-950 text-slate-100 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      
      <LevelUpModal open={showLevelUp} newLevel={level} onClose={() => setShowLevelUp(false)} />
      
      <GrimoireModal isOpen={showGrimoire} onClose={() => setShowGrimoire(false)} />

      {/* --- HUD DINÂMICO --- */}
      {(question || loading) && (
        <div className={`
          w-full max-w-5xl flex justify-between items-center bg-[#151412] p-3 
          border-y-4 backdrop-blur sticky top-0 z-50 transition-colors duration-500
          ${currentTheme.border} ${currentTheme.glow}
        `}>
          
          <div className="flex items-center gap-3">
             {/* Botão Sair */}
             <button onClick={handleExit} className="group w-10 h-10 flex items-center justify-center rounded-full bg-[#0c0a09] border border-stone-600 hover:border-red-500 hover:bg-red-900/20 transition-all shadow-lg" title="Sair da Masmorra">
               <HomeIcon className="w-4 h-4 text-stone-400 group-hover:text-red-400 transition-colors" />
             </button>

             {/* Botão Grimório */}
             <button onClick={handleOpenGrimoire} className={`relative group w-10 h-10 flex items-center justify-center rounded-full bg-[#0c0a09] border transition-all duration-300 hover:scale-110 shadow-lg ${currentTheme.border}`} title="Ver Histórico">
               <div className={`absolute inset-0 rounded-full blur-md animate-pulse opacity-40 ${difficulty === 'hard' ? 'bg-red-600' : difficulty === 'easy' ? 'bg-emerald-500' : 'bg-amber-600'}`} />
               <Book className={`w-4 h-4 transition-colors relative z-10 ${currentTheme.color}`} />
             </button>

             <div className="h-8 w-px bg-stone-700 mx-1" />

             {/* Vida */}
             <div className="flex bg-black/50 p-2 rounded border border-stone-800 gap-1">
              {Array.from({ length: maxHp }).map((_, i) => (
                <Heart key={i} className={`h-5 w-5 transition-all duration-300 drop-shadow-md ${i < hp ? "fill-red-700 text-red-900 scale-100" : "fill-stone-900 text-stone-800 scale-90 opacity-50"}`} />
              ))}
             </div>
          </div>

          {/* BADGE DE DIFICULDADE (CENTRAL/DIREITA) */}
          <div className="hidden md:flex flex-col items-center">
             <span className={`text-xs font-bold tracking-[0.3em] font-[family-name:var(--font-cinzel)] ${currentTheme.color} drop-shadow-sm`}>
               {currentTheme.badge}
             </span>
          </div>

          <div className="flex flex-col items-end w-full max-w-xs">
             <div className={`flex items-center gap-3 font-bold mb-1 font-[family-name:var(--font-cinzel)] ${currentTheme.color}`}>
                <span className="text-xl drop-shadow-sm text-shadow">{xp} XP</span>
                <Trophy className="h-5 w-5" />
             </div>
             <div className="w-full h-2 bg-black border border-stone-600 relative rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${difficulty === 'hard' ? 'bg-red-600' : difficulty === 'easy' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(xp % (level * 50)) * 2}%` }} />
             </div>
             <span className="text-[10px] text-stone-500 uppercase font-bold mt-1 tracking-widest font-mono">Nível {level}</span>
          </div>
        </div>
      )}

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="w-full flex flex-col items-center justify-center flex-1 max-w-6xl relative z-10 pb-10">
        
        {!question && !loading ? (
          
          // LOBBY
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

            {/* SELETOR DE DIFICULDADE (TEXTO PURO ESTILIZADO) */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {[
                { id: 'easy', label: 'Aprendiz', xp: 'Fácil', color: 'text-emerald-400', border: 'border-emerald-800 hover:border-emerald-500' },
                { id: 'medium', label: 'Aventureiro', xp: 'Médio', color: 'text-amber-400', border: 'border-amber-800 hover:border-amber-500' },
                { id: 'hard', label: 'Guardião', xp: 'Difícil', color: 'text-red-500', border: 'border-red-900 hover:border-red-600' },
              ].map((nivel) => (
                <button
                  key={nivel.id}
                  onClick={() => setDifficulty(nivel.id as GameDifficulty)}
                  className={`
                    relative px-8 py-2 rounded-sm border-2 font-[family-name:var(--font-cinzel)] uppercase tracking-widest transition-all duration-300
                    ${difficulty === nivel.id 
                      ? `bg-stone-800 ${nivel.color} ${nivel.border} shadow-lg scale-105 ring-1 ring-white/10` 
                      : `bg-stone-900/50 text-stone-500 border-stone-800 hover:bg-stone-800`
                    }
                  `}
                >
                  {nivel.label}
                </button>
              ))}
            </div>

            {/* GRID DE PORTAIS */}
            <div className="flex flex-col gap-4 w-full md:grid md:grid-cols-2">
              {PORTAIS.slice(0, 4).map((portal) => (
                <button
                  key={portal.id}
                  onClick={() => startGame(portal.id)}
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
              <div className="md:col-span-2 flex justify-center">
                {PORTAIS.slice(4).map((portal) => (
                    <button key={portal.id} onClick={() => startGame(portal.id)} className={`group relative overflow-hidden text-left p-6 rounded-lg border-2 bg-dungeon-stone transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] w-full md:w-[calc(50%-0.5rem)] ${portal.border} ${portal.glow}`}>
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${portal.bgHover}`} />
                        <div className="relative z-10 flex items-start gap-5">
                            <div className={`p-4 rounded-full bg-black/40 border border-white/10 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}><portal.icon className={`w-8 h-8 ${portal.color}`} /></div>
                            <div className="flex-1"><h3 className={`text-xl font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wide mb-1 ${portal.color} drop-shadow-sm`}>{portal.titulo}</h3><p className="text-stone-400 font-[family-name:var(--font-medieval)] text-sm leading-relaxed group-hover:text-stone-200 transition-colors">{portal.desc}</p></div>
                            <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"><Swords className={`w-5 h-5 ${portal.color}`} /></div>
                        </div>
                    </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-stone-700 font-mono mt-12 uppercase tracking-widest opacity-40">v1.4 • Crônicas do Vestibular</div>
          </div>

        ) : (
          <div className="w-full flex justify-center min-h-[400px] mt-8">
            {loading ? (
              <div className="flex flex-col items-center gap-6 mt-32 animate-pulse">
                <div className="relative"><div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" /><Loader2 className="h-20 w-20 text-stone-400 animate-spin relative z-10" /></div>
                <p className="text-stone-500 font-[family-name:var(--font-cinzel)] text-2xl tracking-widest uppercase">Abrindo o Portal...</p>
              </div>
            ) : (
              <BattleCard monster={question!} onAttack={handleAttack} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}