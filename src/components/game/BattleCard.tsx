"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monster } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Swords, Skull, Flame, Scroll } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BattleCardProps {
  monster: Monster;
  onAttack: (isCorrect: boolean) => void;
}

export function BattleCard({ monster, onAttack }: BattleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const difficultyColor = {
    mob: "bg-slate-600 border-slate-500",
    elite: "bg-blue-900 border-blue-700",
    boss: "bg-red-900 border-red-700",
  };

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionId);
    
    if (!isCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setTimeout(() => {
      onAttack(isCorrect);
      setSelectedOption(null);
    }, 1000);
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-15, 15, -15, 15, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl px-4"
    >
      {/* MOLDURA DE PEDRA (Container Principal) 
         Usa a classe .bg-stone-slab que criamos
      */}
      <Card className="border-4 border-stone-800 bg-stone-slab text-stone-200 shadow-2xl relative overflow-hidden rounded-sm">
        
        {/* Adorno: Efeito de Luz no Topo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />

        {/* CABEÇALHO ESCURO */}
        <CardHeader className="border-b-4 border-stone-900 pb-4 bg-black/40">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <Badge className={`text-white px-3 py-1 border-2 font-bold tracking-widest ${difficultyColor[monster.difficulty]}`}>
                {monster.difficulty.toUpperCase()}
              </Badge>
              
              {/* Título com Fonte Épica */}
              <CardTitle className="text-xl md:text-2xl text-amber-500 flex items-center gap-2 font-[family-name:var(--font-cinzel)] drop-shadow-md">
                {monster.difficulty === 'boss' ? <Skull className="h-6 w-6" /> : <Swords className="h-6 w-6" />}
                {monster.name}
              </CardTitle>
            </div>
            
            {/* Barra de Vida */}
            <div className="w-1/3 flex flex-col items-end gap-1">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Vigor</span>
              <Progress value={(monster.hp / monster.maxHp) * 100} className="h-2 bg-stone-950 border border-stone-700" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 space-y-8">
          
          {/* PERGAMINHO (Área do Texto)
             Usa .bg-parchment para dar o fundo de papel claro
          */}
          <div className="bg-parchment p-6 md:p-8 rounded shadow-inner border-2 border-[#d4c5a5] relative">
            
            {/* Ícone decorativo de pergaminho */}
            <div className="absolute -top-3 -left-2 text-[#8b4513] opacity-80 bg-parchment rounded-full p-1 border border-[#8b4513]/30">
               <Scroll className="w-5 h-5" />
            </div>

            {/* Texto em Markdown (Escuro para contraste) */}
            <div className="
              prose prose-stone max-w-none 
              prose-p:text-[#292524] prose-p:font-[family-name:var(--font-medieval)] prose-p:text-lg prose-p:leading-relaxed
              prose-headings:text-[#451a03] prose-headings:font-[family-name:var(--font-cinzel)]
              prose-strong:text-[#451a03]
              prose-img:rounded-md prose-img:border-4 prose-img:border-[#8b4513]/20
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {monster.fullText}
              </ReactMarkdown>
            </div>

            {/* Imagem Externa (Se existir) */}
            {monster.imageUrl && (
              <div className="mt-6 border-4 border-[#8b4513]/20 p-2 bg-white/50 rounded shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={monster.imageUrl} 
                  alt="Enigma Visual" 
                  className="object-contain w-full h-full max-h-80 mix-blend-multiply"
                />
              </div>
            )}
          </div>

          {/* Alternativas (Ainda simples, vamos melhorar na Fase 3) */}
          <div className="grid gap-3">
            {monster.options.map((opt) => {
              let btnClass = "border-stone-600 bg-stone-800/80 hover:bg-stone-700 text-stone-200";
              
              if (selectedOption === opt.id) {
                if (opt.isCorrect) {
                  btnClass = "bg-green-800 border-green-500 text-white";
                } else {
                  btnClass = "bg-red-800 border-red-500 text-white";
                }
              }

              return (
                <Button
                  key={opt.id}
                  variant="ghost"
                  className={`justify-start text-left h-auto py-4 px-6 border-2 ${btnClass}`}
                  onClick={() => handleOptionClick(opt.id, opt.isCorrect)}
                  disabled={selectedOption !== null}
                >
                  <span className="font-bold mr-4 border border-white/20 rounded w-8 h-8 flex items-center justify-center shrink-0 font-[family-name:var(--font-cinzel)]">
                    {opt.id}
                  </span>
                  <span className="whitespace-normal leading-snug font-[family-name:var(--font-medieval)] text-lg">
                    {opt.text}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="justify-center pt-4 pb-6 bg-black/20 border-t border-stone-800">
          <p className="text-xs text-stone-500 font-[family-name:var(--font-cinzel)] tracking-widest uppercase">
            A sabedoria é sua espada
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}