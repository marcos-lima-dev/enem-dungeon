"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monster } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Swords, Skull, Image as ImageIcon } from "lucide-react"; // Adicionei ícone de imagem

interface BattleCardProps {
  monster: Monster;
  onAttack: (isCorrect: boolean) => void;
}

export function BattleCard({ monster, onAttack }: BattleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const difficultyColor = {
    mob: "bg-slate-500",
    elite: "bg-blue-600",
    boss: "bg-red-600",
  };

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    // Evita cliques múltiplos
    if (selectedOption !== null) return;

    setSelectedOption(optionId);
    
    if (!isCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setTimeout(() => {
      onAttack(isCorrect);
      setSelectedOption(null);
    }, 800);
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl" // Aumentei um pouco a largura para caber melhor imagens
    >
      <Card className="border-2 border-slate-800 shadow-xl bg-slate-950 text-slate-100">
        
        {/* --- CABEÇALHO --- */}
        <CardHeader className="border-b border-slate-800 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Badge className={`${difficultyColor[monster.difficulty]} hover:${difficultyColor[monster.difficulty]}`}>
                {monster.difficulty.toUpperCase()}
              </Badge>
              <CardTitle className="text-xl text-yellow-500 flex items-center gap-2">
                {monster.difficulty === 'boss' ? <Skull className="h-5 w-5" /> : <Swords className="h-5 w-5" />}
                {monster.name}
              </CardTitle>
            </div>
            
            <div className="w-1/3 flex flex-col items-end gap-1">
              <span className="text-xs text-slate-400">HP Inimigo</span>
              <Progress value={(monster.hp / monster.maxHp) * 100} className="h-2 bg-slate-800" />
            </div>
          </div>
        </CardHeader>

        {/* --- CONTEÚDO --- */}
        <CardContent className="pt-6 space-y-6">
          
          {/* 1. Texto da Questão */}
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base bg-slate-900/50 p-4 rounded-lg border border-slate-800 whitespace-pre-line">
            {monster.fullText}
          </div>

          {/* 2. Imagem (NOVO BLOCO) - Só renderiza se existir */}
          {monster.imageUrl && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center group">
              {/* Usando img normal para garantir compatibilidade com qualquer URL externa sem configurar next.config.js agora */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={monster.imageUrl} 
                alt="Desafio visual da questão" 
                className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          {/* 3. Alternativas */}
          <div className="grid gap-3">
            {monster.options.map((opt) => {
              let btnClass = "border-slate-700 hover:bg-slate-800 hover:text-slate-100 justify-start text-left h-auto py-4";

              if (selectedOption === opt.id) {
                if (opt.isCorrect) {
                  btnClass = "bg-green-600 hover:bg-green-700 border-green-500 text-white justify-start text-left h-auto py-4 ring-2 ring-green-400/50";
                } else {
                  btnClass = "bg-red-600 hover:bg-red-700 border-red-500 text-white justify-start text-left h-auto py-4 ring-2 ring-red-400/50";
                }
              }

              return (
                <Button
                  key={opt.id}
                  variant="ghost"
                  className={`${btnClass} transition-all duration-200`}
                  onClick={() => handleOptionClick(opt.id, opt.isCorrect)}
                  disabled={selectedOption !== null}
                >
                  <span className={`font-bold mr-4 border rounded w-8 h-8 flex items-center justify-center shrink-0 ${
                    selectedOption === opt.id ? "border-transparent text-white" : "border-slate-600 text-slate-400"
                  }`}>
                    {opt.id}
                  </span>
                  <span className="whitespace-normal leading-snug w-full">{opt.text}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="justify-center pt-2 pb-6 text-xs text-slate-500 font-mono">
          Escolha com sabedoria. Um erro custará sua vida.
        </CardFooter>
      </Card>
    </motion.div>
  );
}