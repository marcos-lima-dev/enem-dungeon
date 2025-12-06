"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createMonsterFromQuestion } from "@/lib/monster-factory";
import { useGameStore } from "@/store/use-game-store";
import { EnemQuestion, Monster } from "@/types/game"; // Importei Monster para tipagem
import { BattleCard } from "@/components/game/BattleCard";
import { Loader2, Heart, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { hp, xp, level, takeDamage, addXp } = useGameStore();
  const [loading, setLoading] = useState(false);
  // Melhoria: Tipagem explícita em vez de 'any'
  const [question, setQuestion] = useState<Monster | null>(null);

  async function fetchNewMonster() {
    setLoading(true);
    try {
      // Offset aleatório para variar as questões
      const randomOffset = Math.floor(Math.random() * 1000);
      
      // Chama nossa API Route (Túnel)
      const res = await fetch(`/api/monster`);
      
      // Melhoria: Verifica se a resposta HTTP foi sucesso (200-299)
      if (!res.ok) {
        throw new Error("Falha na comunicação com a masmorra");
      }

      const data = await res.json();

      // Melhoria: Garante que recebemos dados antes de tentar acessar o índice [0]
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Nenhum monstro encontrado nesta região");
      }

      // Converte para nosso formato de RPG
      const monster = createMonsterFromQuestion(data[0] as EnemQuestion);
      setQuestion(monster);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao invocar monstro. A masmorra está instável.");
    } finally {
      setLoading(false);
    }
  }

  // Lógica de Combate
  const handleAttack = (isCorrect: boolean) => {
    if (isCorrect) {
      toast.success("CRÍTICO! Monstro derrotado!");
      addXp(50);
      
      // Pequeno delay para dar tempo de ver a animação de acerto antes de limpar
      setTimeout(() => {
        setQuestion(null); 
      }, 1000);
      
    } else {
      toast.error("DANO SOFRIDO! -1 Coração");
      takeDamage(1);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 gap-8 bg-slate-950 text-slate-100">
      
      {/* HUD Superior (Heads-Up Display) */}
      <div className="w-full max-w-2xl flex justify-between items-center bg-slate-900/90 p-4 rounded-xl border border-slate-800 backdrop-blur sticky top-4 z-20 shadow-xl shadow-purple-900/10">
        
        {/* Vida */}
        <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
          <Heart className="fill-red-500 h-6 w-6" />
          <span className="text-xl">{hp}</span>
        </div>
        
        {/* Barra de XP */}
        <div className="flex flex-col items-center w-full max-w-[120px] md:max-w-[200px]">
           <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-bold">Nível {level}</span>
           <div className="w-full h-2 bg-slate-800 rounded-full mt-1 overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500 ease-out" 
                style={{ width: `${(xp % 100)}%` }}
              ></div>
           </div>
        </div>

        {/* Pontuação */}
        <div className="flex items-center gap-2 text-yellow-500 font-bold">
          <span className="text-xl">{xp}</span>
          <Trophy className="h-6 w-6 fill-yellow-500/20" />
        </div>
      </div>

      {/* Área Principal */}
      <div className="w-full flex flex-col items-center justify-center flex-1 max-w-4xl relative z-10">
        {!question ? (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10">
            
            {/* Logo Oficial */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto group cursor-pointer">
              <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image 
                src="/logo.png" 
                alt="ENEM Dungeon Logo"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1"
                priority
              />
            </div>

            <div className="space-y-4">
              <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                A masmorra aguarda. Prove seu conhecimento e torne-se um <span className="text-purple-400 font-bold">Guardião do Saber</span>.
              </p>
              
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg px-10 py-7 h-auto rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.4)] border border-purple-400/30 transition-all hover:scale-105 active:scale-95"
                onClick={fetchNewMonster} 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : (
                  <Zap className="mr-3 h-6 w-6 fill-white" />
                )}
                {loading ? "Invocando..." : "ENTRAR NA MASMORRA"}
              </Button>
            </div>
          </div>
        ) : (
          <BattleCard monster={question} onAttack={handleAttack} />
        )}
      </div>
    </main>
  );
}