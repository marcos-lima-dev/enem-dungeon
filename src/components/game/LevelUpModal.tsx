"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Sparkles } from "lucide-react";
import ReactConfetti from 'react-confetti'; // Vamos adicionar confete!
import { useState, useEffect } from "react";

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
  open: boolean;
}

export function LevelUpModal({ newLevel, onClose, open }: LevelUpModalProps) {
  // Estado para controlar o tamanho da janela para o confete
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          {/* Confete Explosivo */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={500}
              colors={['#fbbf24', '#d97706', '#92400e', '#ffffff']} // Tons de Ouro
            />
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            className="relative w-full max-w-md"
          >
            {/* CARD DE LEVEL UP (Estilo Pedra Épica) */}
            <div className="bg-dungeon-stone border-[6px] border-amber-600 rounded-lg p-1 shadow-[0_0_100px_rgba(245,158,11,0.5)] relative overflow-hidden">
              
              {/* Brilho de Fundo Girando */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent animate-spin-slow pointer-events-none" />

              <div className="bg-black/80 p-8 text-center relative z-10 rounded-sm border border-amber-900/50">
                
                {/* Ícone de Troféu Flutuante */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mx-auto w-24 h-24 bg-amber-900/50 rounded-full flex items-center justify-center border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-6"
                >
                  <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-md" />
                </motion.div>

                <h2 className="text-3xl font-[family-name:var(--font-cinzel)] text-amber-500 font-bold tracking-widest uppercase mb-2">
                  Level Up!
                </h2>
                
                <div className="text-6xl font-black font-[family-name:var(--font-cinzel)] text-white drop-shadow-[0_4px_0_rgba(180,83,9,1)] mb-6">
                  {newLevel}
                </div>

                <p className="text-stone-300 font-[family-name:var(--font-medieval)] text-lg mb-8">
                  Sua sabedoria cresceu. Você está mais forte, guardião.
                  <br/>
                  <span className="text-green-400 text-sm font-sans font-bold flex items-center justify-center gap-2 mt-2">
                    <HeartCrackIcon /> Vida Restaurada!
                  </span>
                </p>

                <Button 
                  onClick={onClose}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold text-lg h-12 border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest font-[family-name:var(--font-cinzel)]"
                >
                  Continuar Jornada
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Pequeno ícone auxiliar para o texto "Vida Restaurada"
function HeartCrackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}