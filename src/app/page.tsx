"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createMonsterFromQuestion } from "@/lib/monster-factory";
import { useGameStore } from "@/store/use-game-store";
import { EnemQuestion, Monster } from "@/types/game";
import { BattleCard } from "@/components/game/BattleCard";
// Ícones novos para os portais
import { Loader2, Heart, Trophy, Skull, Brain, FlaskConical, Hourglass, BookOpen, Sparkles, Swords } from "lucide-react";
import { toast } from "sonner";
import { useGameSound } from "@/hooks/use-game-sound";
import { LevelUpModal } from "@/components/game/LevelUpModal";

export default function Home() {
  const { hp, xp, level, takeDamage, addXp, resetGame } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Monster | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Estado da Categoria
  const [selectedCategory, setSelectedCategory] = useState<string>('aleatorio');

  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevelRef = useRef(level);
  const { playGameOver, playWin } = useGameSound();

  // --- CONFIGURAÇÃO DOS PORTAIS (LORE) ---
  const PORTAIS = [
    {
      id: 'aleatorio',
      titulo: 'Abismo do Caos',
      desc: 'Desafios imprevisíveis de todas as escolas do saber.',
      icon: Sparkles,
      color: 'text-purple-400',
      border: 'border-purple-500/50',
      bgHover: 'group-hover:bg-purple-900/20',
      glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'
    },
    {
      id: 'matematica',
      titulo: 'Torre dos Enigmas',
      desc: 'Raciocínio lógico e segredos dos números.',
      icon: Brain,
      color: 'text-blue-400',
      border: 'border-blue-500/50',
      bgHover: 'group-hover:bg-blue-900/20',
      glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]'
    },
    {
      id: 'natureza',
      titulo: 'Câmara dos Alquimistas',
      desc: 'Experimentos de Química, Física e vida biológica.',
      icon: FlaskConical,
      color: 'text-green-400',
      border: 'border-green-500/50',
      bgHover: 'group-hover:bg-green-900/20',
      glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]'
    },
    {
      id: 'humanas',
      titulo: 'Relicários do Tempo',
      desc: 'Mistérios da História, Geografia e Sociedade.',
      icon: Hourglass,
      color: 'text-amber-400',
      border: 'border-amber-500/50',
      bgHover: 'group-hover:bg-amber-900/20',
      glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]'
    },
    {
      id: 'linguagens',
      titulo: 'Arquivo dos Sábios',
      desc: 'Interpretação de textos, artes e línguas antigas.',
      icon: BookOpen,
      color: 'text-red-400',
      border: 'border-red-500/50',
      bgHover: 'group-hover:bg-red-900/20',
      glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]',
      fullWidth: true // Esse ocupa 2 colunas
    },
  ];

  // --- EFEITOS E LÓGICA ---
  
  // Monitora Level Up
  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp(true);
      playWin();
      if (!question) fetchNewMonster(selectedCategory);
    }
    prevLevelRef.current = level;
  }, [level, playWin]); 

  // Monitora Game Over
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
      const monster = createMonsterFromQuestion(data[0] as EnemQuestion);
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

  const handleAttack = async (isCorrect: boolean) => {
    if (isCorrect) {
      toast.success("CRÍTICO! Inimigo derrotado!");
      addXp(50);
      setTimeout(() => { fetchNewMonster(selectedCategory); }, 1000);
    } else {
      toast.error("DANO SOFRIDO! -1 Coração");
      takeDamage(1);
    }
  };

  const handleRestart = () => {
    resetGame();
    setIsGameOver(false);
    setQuestion(null);
    prevLevelRef.current = 1;
  };

  // --- TELA DE GAME OVER ---
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

  // --- TELA PRINCIPAL ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 gap-6 bg-slate-950 text-slate-100 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      
      <LevelUpModal open={showLevelUp} newLevel={level} onClose={() => setShowLevelUp(false)} />

      {/* --- HUD --- */}
      {(question || loading) && (
        <div className="w-full max-w-5xl flex justify-between items-center bg-[#151412] p-3 border-y-4 border-amber-900/40 backdrop-blur sticky top-0 z-50 shadow-2xl">
          <div className="flex items-center gap-2">
             <div className="flex bg-black/50 p-2 rounded border border-stone-800">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`h-8 w-8 transition-all duration-300 drop-shadow-md ${i < hp ? "fill-red-700 text-red-900 scale-100" : "fill-stone-900 text-stone-800 scale-90"}`} />
              ))}
             </div>
          </div>
          <div className="flex flex-col items-end w-full max-w-xs">
             <div className="flex items-center gap-3 text-amber-500 font-bold mb-1 font-[family-name:var(--font-cinzel)]">
                <span className="text-xl drop-shadow-sm text-shadow">{xp} XP</span>
                <Trophy className="h-5 w-5 text-amber-600" />
             </div>
             <div className="w-full h-2 bg-black border border-stone-600 relative rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-800 to-amber-600 transition-all duration-500" style={{ width: `${(xp % 1000) / 10}%` }} />
             </div>
             <span className="text-[10px] text-stone-500 uppercase font-bold mt-1 tracking-widest font-mono">Nível {level}</span>
          </div>
        </div>
      )}

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="w-full flex flex-col items-center justify-center flex-1 max-w-6xl relative z-10 pb-10">
        
        {!question && !loading ? (
          
          // --- NOVO LOBBY: PORTAIS DA MASMORRA ---
          <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700 mt-6 w-full max-w-4xl px-4">
            
            {/* Header do Lobby */}
            <div className="flex flex-col items-center gap-4">
               {/* Logo Menor para dar espaço aos portais */}
               <div className="relative w-48 h-48 group cursor-default transition-transform hover:scale-105 duration-500">
                  <div className="absolute inset-0 bg-purple-600/20 blur-[40px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
                  <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-xl relative z-10" priority />
               </div>
               
               <div>
                  <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cinzel)] text-stone-200 font-bold tracking-widest uppercase drop-shadow-md">
                    <span className="text-amber-600">🔥</span> Escolha seu Portal
                  </h2>
                  <p className="text-stone-500 font-[family-name:var(--font-medieval)] text-lg mt-2">
                    Cada dungeon esconde um tipo diferente de desafio...
                  </p>
               </div>
            </div>

            {/* GRID DE PORTAIS (Layout Pirâmide no Desktop) */}
            <div className="flex flex-col gap-4 w-full mt-8 md:grid md:grid-cols-2">
              
              {/* Renderiza os 4 primeiros */}
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
                  {/* Fundo Hover Colorido */}
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${portal.bgHover}`} />
                  
                  <div className="relative z-10 flex items-start gap-5">
                    {/* Ícone */}
                    <div className={`
                      p-4 rounded-full bg-black/40 border border-white/10 shadow-inner
                      transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                    `}>
                      <portal.icon className={`w-8 h-8 ${portal.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wide mb-1 ${portal.color} drop-shadow-sm`}>
                        {portal.titulo}
                      </h3>
                      <p className="text-stone-400 font-[family-name:var(--font-medieval)] text-sm leading-relaxed group-hover:text-stone-200 transition-colors">
                        {portal.desc}
                      </p>
                    </div>

                    <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <Swords className={`w-5 h-5 ${portal.color}`} />
                    </div>
                  </div>
                </button>
              ))}

              {/* O ÚLTIMO PORTAL (Centralizado manualmente para evitar erro de sintaxe) */}
              <div className="md:col-span-2 flex justify-center">
                {PORTAIS.slice(4).map((portal) => (
                    <button
                    key={portal.id}
                    onClick={() => startGame(portal.id)}
                    className={`
                        group relative overflow-hidden text-left p-6 rounded-lg border-2 bg-dungeon-stone
                        transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] w-full md:w-[calc(50%-0.5rem)]
                        ${portal.border} ${portal.glow}
                    `}
                    >
                    <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${portal.bgHover}`} />
                    
                    <div className="relative z-10 flex items-start gap-5">
                        <div className={`
                        p-4 rounded-full bg-black/40 border border-white/10 shadow-inner
                        transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                        `}>
                        <portal.icon className={`w-8 h-8 ${portal.color}`} />
                        </div>
                        
                        <div className="flex-1">
                        <h3 className={`text-xl font-bold font-[family-name:var(--font-cinzel)] uppercase tracking-wide mb-1 ${portal.color} drop-shadow-sm`}>
                            {portal.titulo}
                        </h3>
                        <p className="text-stone-400 font-[family-name:var(--font-medieval)] text-sm leading-relaxed group-hover:text-stone-200 transition-colors">
                            {portal.desc}
                        </p>
                        </div>

                        <div className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                        <Swords className={`w-5 h-5 ${portal.color}`} />
                        </div>
                    </div>
                    </button>
                ))}
              </div>

            </div>

            <div className="text-xs text-stone-700 font-mono mt-12 uppercase tracking-widest opacity-40">
              v1.1 • Crônicas do Vestibular
            </div>
          </div>

        ) : (
          
          // --- MODO BATALHA ---
          <div className="w-full flex justify-center min-h-[400px] mt-8">
            {loading ? (
              <div className="flex flex-col items-center gap-6 mt-32 animate-pulse">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                  <Loader2 className="h-20 w-20 text-stone-400 animate-spin relative z-10" />
                </div>
                <p className="text-stone-500 font-[family-name:var(--font-cinzel)] text-2xl tracking-widest uppercase">
                  Abrindo o Portal...
                </p>
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