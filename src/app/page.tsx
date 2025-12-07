"use client";

import { useState, useEffect, useRef } from "react"; // <--- Adicionei useRef
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createMonsterFromQuestion } from "@/lib/monster-factory";
import { useGameStore } from "@/store/use-game-store";
import { EnemQuestion, Monster } from "@/types/game";
import { BattleCard } from "@/components/game/BattleCard";
import { Loader2, Heart, Trophy, Zap, Skull } from "lucide-react";
import { toast } from "sonner";
import { useGameSound } from "@/hooks/use-game-sound";
import { LevelUpModal } from "@/components/game/LevelUpModal"; // <--- Importe o Modal

export default function Home() {
  const { hp, xp, level, takeDamage, addXp, resetGame } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Monster | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // 1. Estado para controlar o Modal
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // 2. Ref para lembrar qual era o nível anterior
  const prevLevelRef = useRef(level);

  // 3. Hooks de Som (Vitória!)
  const { playGameOver, playWin } = useGameSound();

  // --- EFEITO DE LEVEL UP ---
  useEffect(() => {
    // Se o nível atual for MAIOR que o anterior...
    if (level > prevLevelRef.current) {
      setShowLevelUp(true); // Abre o modal
      playWin(); // Toca som de vitória! 🎺
      
      // Se não tiver monstro na tela (caso tenha matado o último), busca um novo
      if (!question) fetchNewMonster();
    }
    // Atualiza a referência para a próxima vez
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

  async function fetchNewMonster() {
    if (hp <= 0) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/monster?t=${Date.now()}`);
      
      if (!res.ok) throw new Error("Falha na comunicação");

      const data = await res.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Masmorra vazia");
      }

      const monster = createMonsterFromQuestion(data[0] as EnemQuestion);
      setQuestion(monster);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao invocar monstro.");
    } finally {
      setLoading(false);
    }
  }

  const handleAttack = async (isCorrect: boolean) => {
    if (isCorrect) {
      toast.success("CRÍTICO! Inimigo derrotado!");
      addXp(50); // <-- Isso aqui vai disparar o useEffect do Level Up
      
      setTimeout(() => {
        fetchNewMonster(); 
      }, 1000);
      
    } else {
      toast.error("DANO SOFRIDO! -1 Coração");
      takeDamage(1);
    }
  };

  const handleRestart = () => {
    resetGame();
    setIsGameOver(false);
    setQuestion(null);
    prevLevelRef.current = 1; // Reseta a referência de nível
  };

  // --- RENDER ---
  if (isGameOver) {
    // (Mantenha o código do Game Over igual ao anterior)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 animate-in fade-in duration-1000">
        <div className="text-center space-y-6">
          <Skull className="w-32 h-32 text-red-600 mx-auto animate-pulse" />
          <h1 className="text-5xl font-bold text-red-500">FIM DE JOGO</h1>
          <div className="space-y-2">
            <p className="text-xl text-slate-400">Sua jornada terminou no <strong className="text-white">Nível {level}</strong>.</p>
            <p className="text-lg text-yellow-500">XP Final: {xp}</p>
          </div>
          <Button 
            onClick={handleRestart}
            size="lg" 
            className="bg-red-700 hover:bg-red-600 text-white font-bold text-xl px-12 py-8 rounded-xl shadow-lg mt-8"
          >
            RENASCER
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 gap-6 bg-slate-950 text-slate-100">
      
      {/* 4. MODAL DE LEVEL UP (Invisível até ativar) */}
      <LevelUpModal 
        open={showLevelUp} 
        newLevel={level} 
        onClose={() => setShowLevelUp(false)} 
      />

      {/* --- HUD --- */}
      {(question || loading) && (
        <div className="w-full max-w-4xl flex justify-between items-center bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur sticky top-4 z-50 shadow-2xl">
          {/* (Código do HUD igual ao anterior) */}
           <div className="flex items-center gap-2 text-red-500 font-bold">
            <div className="flex">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart 
                  key={i} 
                  className={`h-8 w-8 transition-all duration-300 ${i < hp ? "fill-red-600 text-red-600 scale-100" : "fill-slate-800 text-slate-700 scale-90"}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2 text-yellow-400 font-bold mb-1">
                <span className="text-2xl">{xp}</span>
                <Trophy className="h-6 w-6" />
             </div>
             <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                {/* DICA: Ajuste o width para refletir o XP do nível atual, não total */}
                <div 
                  className="h-full bg-yellow-500 transition-all duration-500" 
                  style={{ width: `${(xp % 1000) / 10}%` }} 
                />
             </div>
             <span className="text-[10px] text-slate-500 uppercase font-bold mt-1">Nível {level}</span>
          </div>
        </div>
      )}

      {/* Área Principal */}
      <div className="w-full flex flex-col items-center justify-center flex-1 max-w-5xl relative z-10 pb-10">
        {!question && !loading ? (
          
          // LOBBY (Igual ao anterior)
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700 mt-10">
             {/* (Código da Logo e Botão igual ao anterior) */}
             <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto group">
              <div className="absolute inset-0 bg-purple-600/20 blur-[60px] rounded-full opacity-60 animate-pulse" />
              <Image 
                src="/logo.png" 
                alt="ENEM Dungeon Logo"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl relative z-10"
                priority
              />
            </div>
            <div className="space-y-6">
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Enfrente os monstros do conhecimento. Sua sabedoria é sua única arma.
              </p>
              <Button 
                size="lg" 
                className="bg-purple-700 hover:bg-purple-600 text-white font-bold text-xl px-12 py-8 h-auto rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.3)] border border-purple-500/30 transition-all hover:scale-105 active:scale-95"
                onClick={fetchNewMonster} 
              >
                <Zap className="mr-3 h-6 w-6 fill-white" />
                ENTRAR NA MASMORRA
              </Button>
            </div>
          </div>

        ) : (
          
          // MODO BATALHA (Igual ao anterior)
          <div className="w-full flex justify-center min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center gap-4 mt-20 animate-pulse">
                <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />
                <p className="text-slate-400 text-xl font-bold">Invocando criatura...</p>
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