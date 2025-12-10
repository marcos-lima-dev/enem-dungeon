"use client";

import { useState, useEffect, useRef } from "react";
import { createMonsterFromQuestion } from "@/lib/monster-factory";
import { useGameStore } from "@/store/use-game-store";
import { QuestaoLimpa, Monster } from "@/types/game";
import { BattleCard } from "@/components/game/BattleCard";
import { LevelUpModal } from "@/components/game/LevelUpModal";
import { GrimoireModal } from "@/components/game/GrimoireModal";
import { GameHUD } from "@/components/game/GameHUD";
import { GameLobby } from "@/components/game/GameLobby";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { useGameSound } from "@/hooks/use-game-sound";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { 
    hp, maxHp, xp, level, takeDamage, 
    registerCorrectAnswer, resetGame, difficulty, setDifficulty, addToHistory 
  } = useGameStore();
  
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<Monster | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('aleatorio');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showGrimoire, setShowGrimoire] = useState(false);
  
  const prevLevelRef = useRef(level);
  const { playGameOver, playWin, playHit } = useGameSound();

  // Efeito de Level Up
  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp(true);
      playWin();
      if (!question) fetchNewMonster(selectedCategory);
    }
    prevLevelRef.current = level;
  }, [level, playWin]); 

  // Efeito de Game Over
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
      const result = registerCorrectAnswer(); 
      toast.success("CRÍTICO! Inimigo derrotado!");
      if (result.healed) setTimeout(() => toast.success("COMBO! +1 Coração recuperado! ❤️"), 300);
    } else {
      toast.error("DANO SOFRIDO! -1 Coração");
      takeDamage(1);
    }
    setTimeout(() => { fetchNewMonster(selectedCategory); }, 2500);
  };

  const handleRestart = () => {
    resetGame();
    setIsGameOver(false);
    setQuestion(null);
    prevLevelRef.current = 1;
  };

  if (isGameOver) {
    return <GameOverScreen level={level} xp={xp} onRestart={handleRestart} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 gap-6 bg-slate-950 text-slate-100 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      
      <LevelUpModal open={showLevelUp} newLevel={level} onClose={() => setShowLevelUp(false)} />
      <GrimoireModal isOpen={showGrimoire} onClose={() => setShowGrimoire(false)} />

      {/* HUD - BARRA SUPERIOR */}
      {(question || loading) && (
        <GameHUD 
          hp={hp} maxHp={maxHp} xp={xp} level={level} 
          onExit={handleExit} 
          onOpenGrimoire={() => { playHit(); setShowGrimoire(true); }} 
        />
      )}

      {/* ÁREA PRINCIPAL */}
      <div className="w-full flex flex-col items-center justify-center flex-1 max-w-6xl relative z-10 pb-10">
        {!question && !loading ? (
          // LOBBY
          <GameLobby 
            difficulty={difficulty} 
            setDifficulty={setDifficulty} 
            onStartGame={startGame} 
          />
        ) : (
          // ÁREA DE BATALHA
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