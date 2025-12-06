"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monster } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import { Swords, Skull, Flame, Scroll, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BattleCardProps {
  monster: Monster;
  onAttack: (isCorrect: boolean) => void;
}

export function BattleCard({ monster, onAttack }: BattleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

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
    }, 1200);
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-15, 15, -15, 15, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 mt-8"
    >
      {/* 1. MOLDURA DE PEDRA (O Container) */}
      <div className="relative bg-dungeon-stone rounded-sm p-1 shadow-2xl border-t-[1px] border-white/10">
        
        {/* Adorno: Parafusos nos cantos */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-black/60 border border-white/10 shadow-inner z-10" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-black/60 border border-white/10 shadow-inner z-10" />

        {/* 2. CABEÇALHO ESCURO */}
        <div className="bg-black/40 border-b-4 border-black p-6 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-sm">
          
          <div className="flex items-center gap-4">
            {/* Ícone de Classe */}
            <div className={`
              w-14 h-14 flex items-center justify-center border-2 rotate-45 shadow-lg
              ${monster.difficulty === 'boss' ? 'bg-red-950 border-red-800' : 'bg-stone-800 border-stone-600'}
            `}>
              <div className="-rotate-45 glow-magic">
                 {monster.difficulty === 'boss' ? <Skull className="h-7 w-7 text-red-500" /> : <Swords className="h-7 w-7 text-stone-400" />}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-stone-500 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <Flame className="w-3 h-3 text-orange-600 fill-orange-600" />
                {monster.category}
              </span>
              <h2 className="text-2xl text-amber-500 font-[family-name:var(--font-cinzel)] font-bold drop-shadow-md">
                {monster.name}
              </h2>
            </div>
          </div>

          {/* Barra de Vida Inimiga */}
          <div className="w-full md:w-40 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-red-800 font-bold uppercase">
              <span>HP Inimigo</span>
              <span>{monster.hp}/{monster.maxHp}</span>
            </div>
            <div className="h-2 bg-black border border-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-700 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. PERGAMINHO (Área da Questão) */}
        <div className="p-4 md:p-8 bg-[#151413]">
          
          {/* O Papel em si */}
          <div className="bg-parchment p-6 md:p-10 relative shadow-lg transform md:-rotate-[0.5deg]">
            
            {/* "Selo" de cera segurando o papel */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-900 border-4 border-red-950 shadow-lg z-10 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-800 rounded-full opacity-50" />
            </div>

            {/* Texto da Questão (Escuro para leitura) */}
            <div className="
              prose prose-stone max-w-none 
              prose-p:text-[#292524] prose-p:font-[family-name:var(--font-medieval)] prose-p:text-xl prose-p:leading-loose
              prose-headings:text-[#451a03] prose-headings:font-[family-name:var(--font-cinzel)]
              prose-strong:text-[#78350f]
              prose-img:border-4 prose-img:border-[#78350f]/20 prose-img:rounded prose-img:shadow-md
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {monster.fullText}
              </ReactMarkdown>
            </div>

            {/* Imagem da Questão (Se houver) */}
            {monster.imageUrl && (
              <div className="mt-8 border-4 border-[#78350f]/20 p-2 bg-white/40 rounded shadow-inner rotate-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={monster.imageUrl} 
                  alt="Enigma Visual" 
                  className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply"
                />
              </div>
            )}
          </div>

        </div>

        {/* 4. RODAPÉ (Botões de Pedra) */}
        <div className="bg-[#0c0a09] p-6 border-t border-white/5">
          <div className="grid gap-3">
            {monster.options.map((opt) => {
              // Estilo Base do Botão
              let btnStyle = "btn-stone";
              let badgeStyle = "bg-[#1c1917] border border-stone-600 text-stone-500";

              // Estilo quando selecionado
              if (selectedOption === opt.id) {
                if (opt.isCorrect) {
                  // ACERTO: Verde/Dourado
                  btnStyle = "bg-green-900 border-green-600 text-green-100 transform translate-y-[3px] border-b-[1px] shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                  badgeStyle = "bg-green-950 border-green-500 text-green-400";
                } else {
                  // ERRO: Vermelho
                  btnStyle = "bg-red-950 border-red-800 text-red-200 transform translate-y-[3px] border-b-[1px] shadow-[0_0_20px_rgba(220,38,38,0.3)]";
                  badgeStyle = "bg-red-900 border-red-500 text-red-200";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionClick(opt.id, opt.isCorrect)}
                  className={`
                    w-full relative flex items-center p-3 md:p-4 rounded font-[family-name:var(--font-medieval)] text-lg text-left group
                    ${btnStyle}
                  `}
                >
                  {/* Letra (Runa) */}
                  <div className={`
                    w-10 h-10 flex items-center justify-center rounded font-bold text-xl font-[family-name:var(--font-cinzel)] mr-4 shrink-0 shadow-inner transition-colors
                    ${badgeStyle}
                  `}>
                    {opt.id}
                  </div>
                  
                  {/* Texto */}
                  <span className="leading-snug">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
}