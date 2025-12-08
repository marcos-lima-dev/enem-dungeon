"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monster } from "@/types/game";
import { Swords, Skull, Flame, Scroll, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGameSound } from "@/hooks/use-game-sound";

interface BattleCardProps {
  monster: Monster;
  onAttack: (isCorrect: boolean) => void;
}

export function BattleCard({ monster, onAttack }: BattleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  
  const { playHit, playMiss } = useGameSound();

  const RUNES = "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ";

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      playHit(); 
    } else {
      playMiss();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setTimeout(() => {
      onAttack(isCorrect);
      setSelectedOption(null);
    }, 2500);
  };

  return (
    <motion.div
      animate={isShaking ? { x: [-15, 15, -15, 15, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 mt-8 perspective-1000"
    >
      {/* 1. MOLDURA DE PEDRA */}
      <div className="relative bg-dungeon-stone rounded-xl border-x-[6px] border-t-[6px] border-b-[12px] border-[#292524] shadow-[0_0_100px_rgba(88,28,135,0.4)] overflow-hidden">
        
        {/* Adornos */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-black/60 border border-white/10 shadow-inner z-20" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-black/60 border border-white/10 shadow-inner z-20" />

        {/* 2. CABEÇALHO */}
        <div className="relative bg-black/40 border-b-4 border-[#1c1917] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="absolute top-1 left-0 w-full text-center text-[10px] text-rune-glow opacity-30 font-mono tracking-[1.5em] select-none pointer-events-none">
            {RUNES}
          </div>

          <div className="flex items-center gap-4 z-10 w-full">
            <div className={`
              w-16 h-16 flex-shrink-0 flex items-center justify-center border-4 rotate-45 shadow-2xl 
              ${monster.difficulty === 'boss' ? 'bg-red-950 border-red-800' : 'bg-stone-800 border-stone-600'}
            `}>
              <div className="-rotate-45 filter drop-shadow-lg">
                 {monster.difficulty === 'boss' ? <Skull className="h-8 w-8 text-red-500 animate-pulse" /> : <Swords className="h-8 w-8 text-slate-400" />}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-cinzel)]">
                <Flame className="w-3 h-3 fill-current" />
                {monster.category}
                <span className="text-stone-600">|</span>
                <span className={monster.difficulty === 'boss' ? "text-red-500" : "text-stone-400"}>
                  {monster.difficulty.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl text-stone-100 font-[family-name:var(--font-cinzel)] font-black text-shadow-lg leading-none mt-1">
                {monster.name}
              </h1>
            </div>
          </div>

          <div className="w-full md:w-48 z-10">
            <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase mb-1">
              <span>HP Inimigo</span>
              <span>{monster.hp}/{monster.maxHp}</span>
            </div>
            <div className="h-3 bg-black border border-stone-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-900 to-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. CORPO (O Pergaminho - AGORA COM TEXTO GIGANTE E ESCURO) */}
        <div className="p-6 md:p-8 bg-[#151412] relative">
          <div className="bg-parchment p-6 md:p-10 rounded-sm shadow-xl relative transform md:-rotate-[0.5deg] transition-transform hover:rotate-0 duration-500">
            
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-900 border-2 border-red-700 shadow-lg z-20 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-950 rounded-full opacity-50" />
            </div>

            <div className="absolute top-4 right-4 text-[#8b4513] opacity-20">
               <Scroll className="w-12 h-12" />
            </div>

            {/* --- ÁREA DO TEXTO MELHORADA PARA LEITURA --- */}
            <div className="
              prose prose-stone max-w-none 
              
              /* COR: Preto absoluto para contraste máximo */
              prose-p:text-black 
              
              /* FONTE: MedievalSharp (temática) */
              prose-p:font-[family-name:var(--font-medieval)] 
              
              /* TAMANHO: xl no celular, 2xl no PC (Gigante!) */
              prose-p:text-xl md:prose-p:text-2xl 
              
              /* PESO: Médio/Semibold para encorpar a letra */
              prose-p:font-medium
              
              /* ESPAÇAMENTO: Relaxado para não embolar */
              prose-p:leading-loose
              
              prose-headings:text-[#3f1d0b] prose-headings:font-[family-name:var(--font-cinzel)] prose-headings:font-black
              prose-strong:text-[#4a0404] prose-strong:font-bold
              prose-img:border-4 prose-img:border-[#57534e] prose-img:rounded-sm prose-img:shadow-md
              prose-table:border prose-table:border-[#57534e] prose-th:bg-[#d6d3d1] prose-th:p-3 prose-td:p-3 prose-td:text-lg
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {monster.fullText}
              </ReactMarkdown>
            </div>

            {monster.imageUrl && (
              <div className="mt-8 border-4 border-[#57534e]/50 p-2 bg-white/40 rounded shadow-inner rotate-1 group">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={monster.imageUrl} 
                    alt="Imagem da questão"
                    className="w-full h-auto object-contain max-h-[400px] mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded text-white">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. RODAPÉ - GABARITO VISUAL (Botões Maiores) */}
        <div className="bg-[#0c0a09] p-6 border-t-4 border-[#292524]">
          <div className="grid gap-3">
            {monster.options.map((opt) => {
              let btnClass = "btn-stone"; 
              let runeClass = "text-stone-500 border-stone-700 bg-[#151412]";

              if (selectedOption !== null) {
                if (opt.isCorrect) {
                  btnClass = "btn-stone-correct ring-2 ring-green-400 ring-offset-2 ring-offset-black";
                  runeClass = "text-green-200 border-green-500 bg-green-900";
                } else if (selectedOption === opt.id && !opt.isCorrect) {
                  btnClass = "btn-stone-wrong opacity-90"; 
                  runeClass = "text-red-200 border-red-500 bg-red-900";
                } else {
                  btnClass = "btn-stone opacity-40 grayscale"; 
                  runeClass = "text-stone-700 border-stone-800 bg-black";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionClick(opt.id, opt.isCorrect)}
                  className={`
                    w-full relative flex items-stretch text-left rounded-sm group transition-all duration-300
                    ${btnClass}
                  `}
                >
                  <div className={`
                    w-16 flex items-center justify-center border-r-2 font-bold text-2xl rune-box
                    transition-colors duration-300
                    ${runeClass}
                  `}>
                    {opt.id}
                  </div>
                  
                  <div className="p-5 flex-1 flex items-center">
                    {/* Aumentei a fonte dos botões também para combinar */}
                    <span className="leading-snug font-[family-name:var(--font-medieval)] text-xl text-stone-200 group-hover:text-white transition-colors font-medium">
                      {opt.text}
                    </span>
                  </div>

                  {!selectedOption && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay rounded-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
}