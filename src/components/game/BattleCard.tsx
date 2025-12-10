"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Monster } from "@/types/game";
import { useGameSound } from "@/hooks/use-game-sound";
import { useGameStore } from "@/store/use-game-store";

// Importando os sub-componentes
import { BattleHeader } from "./battle/BattleHeader";
import { BattleContent } from "./battle/BattleContent";
import { BattleOptions } from "./battle/BattleOptions";

interface BattleCardProps {
  monster: Monster;
  onAttack: (isCorrect: boolean) => void;
}

export function BattleCard({ monster, onAttack }: BattleCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  
  const { playHit, playMiss } = useGameSound();
  const { difficulty } = useGameStore();

  const THEME = {
    easy: "border-emerald-900 shadow-[0_0_100px_rgba(16,185,129,0.2)]",
    medium: "border-[#292524] shadow-[0_0_100px_rgba(245,158,11,0.2)]",
    hard: "border-red-950 shadow-[0_0_100px_rgba(220,38,38,0.3)]"
  };

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
      <div className={`
        relative bg-dungeon-stone rounded-xl border-x-[6px] border-t-[6px] border-b-[12px] 
        overflow-hidden transition-colors duration-500 
        ${THEME[difficulty]}
      `}>
        {/* Adornos da Moldura */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-black/60 border border-white/10 shadow-inner z-20" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-black/60 border border-white/10 shadow-inner z-20" />

        {/* --- COMPONENTES FILHOS --- */}
        <BattleHeader monster={monster} />
        
        <BattleContent monster={monster} />
        
        <BattleOptions 
          options={monster.options} 
          selectedOption={selectedOption} 
          onSelect={handleOptionClick} 
        />

      </div>
    </motion.div>
  );
}