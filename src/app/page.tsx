"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createMonsterFromQuestion } from "@/lib/monster-factory";
import { useGameStore } from "@/store/use-game-store";
import { EnemQuestion } from "@/types/game";

export default function Home() {
  // Conecta com a Store Global
  const { hp, xp, level, takeDamage, addXp } = useGameStore();
  
  // Estado local apenas para carregar a questão
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<any>(null);

  // Simula buscar na API do ENEM
  async function fetchNewMonster() {
    setLoading(true);
    try {
      // Pegando uma questão real da API do yunger7
      const res = await fetch("https://api.enem.dev/v1/exams/2023/questions?limit=1");
      const data = await res.json();
      
      // A Mágica: Transforma JSON chato em Monstro RPG
      const monster = createMonsterFromQuestion(data[0] as EnemQuestion);
      setQuestion(monster);
    } catch (error) {
      console.error("Erro ao caçar monstro:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      {/* HUD (Heads-Up Display) */}
      <div className="flex gap-8 text-xl font-bold border p-4 rounded-lg bg-slate-100">
        <span className="text-red-600">❤ HP: {hp}</span>
        <span className="text-blue-600">✨ XP: {xp}</span>
        <span className="text-purple-600">⚔ Lvl: {level}</span>
      </div>

      {/* Arena de Batalha */}
      <div className="flex flex-col gap-4 items-center">
        {!question ? (
          <Button onClick={fetchNewMonster} disabled={loading}>
            {loading ? "Invocando..." : "Caçar Monstro"}
          </Button>
        ) : (
          <div className="border p-6 rounded-xl max-w-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{question.name}</h2>
            <div className="bg-slate-50 p-4 rounded mb-4 max-h-60 overflow-y-auto">
              <p className="text-sm">{question.fullText}</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {question.options.map((opt: any) => (
                <Button 
                  key={opt.id} 
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left hover:bg-slate-100"
                  onClick={() => {
                    if (opt.isCorrect) {
                      alert("CRÍTICO! Você acertou!");
                      addXp(50);
                      setQuestion(null); // Mata o monstro
                    } else {
                      alert("DANO! Você errou.");
                      takeDamage(1);
                    }
                  }}
                >
                  <span className="font-bold mr-2 text-slate-500">[{opt.id}]</span> 
                  {opt.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}