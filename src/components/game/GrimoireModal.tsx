"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, ScrollText, Swords } from "lucide-react";
import { useGameStore } from "@/store/use-game-store";

interface GrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GrimoireModal({ isOpen, onClose }: GrimoireModalProps) {
  const { history } = useGameStore();

  // Cálculos Estatísticos
  const totalBattles = history.length;
  const victories = history.filter(h => h.isCorrect).length;
  const winRate = totalBattles > 0 ? Math.round((victories / totalBattles) * 100) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl h-[80vh] flex flex-col relative"
          >
            {/* --- MOLDURA DE LIVRO ANTIGO --- */}
            <div className="absolute inset-0 bg-[#2b2520] rounded-lg shadow-2xl border-4 border-[#3f3b36]" />
            
            {/* CABEÇALHO */}
            <div className="relative z-10 bg-[#1c1917] p-6 border-b-4 border-[#3f3b36] flex justify-between items-center rounded-t-lg">
              <div className="flex items-center gap-3">
                <ScrollText className="w-8 h-8 text-amber-500" />
                <h2 className="text-2xl font-[family-name:var(--font-cinzel)] text-stone-200 font-bold tracking-widest uppercase">
                  Grimório de Batalhas
                </h2>
              </div>
              <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* ESTATÍSTICAS (HUD INTERNO) */}
            <div className="relative z-10 bg-[#151412] p-6 grid grid-cols-3 gap-4 border-b border-white/5">
              <StatBox label="Batalhas" value={totalBattles} icon={<Swords className="w-4 h-4 text-stone-400" />} />
              <StatBox label="Vitórias" value={victories} icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} />
              <StatBox label="Precisão" value={`${winRate}%`} icon={<TrophyIcon />} highlight />
            </div>

            {/* LISTA DE REGISTROS (SCROLL) */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-3 bg-dungeon-stone scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900">
              {history.length === 0 ? (
                <div className="text-center text-stone-500 py-10 font-[family-name:var(--font-medieval)] text-xl">
                  Nenhum registro encontrado nas ruínas...
                </div>
              ) : (
                history.map((record) => (
                  <div 
                    key={record.id} 
                    className="flex items-center justify-between p-4 bg-[#1c1917] border border-stone-700 rounded hover:border-stone-500 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {record.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className="text-stone-300 font-bold text-sm uppercase tracking-wide">
                          {record.category}
                        </p>
                        <p className="text-stone-500 text-xs font-mono">
                          {new Date(record.timestamp).toLocaleTimeString()} • {new Date(record.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${record.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {record.isCorrect ? 'VITORIA' : 'DERROTA'}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RODAPÉ */}
            <div className="relative z-10 bg-[#1c1917] p-4 border-t-4 border-[#3f3b36] rounded-b-lg text-center">
              <p className="text-xs text-stone-600 font-mono uppercase">Histórico das últimas 50 batalhas</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Componentes Auxiliares
function StatBox({ label, value, icon, highlight = false }: any) {
  return (
    <div className={`p-3 rounded border ${highlight ? 'bg-amber-900/20 border-amber-700' : 'bg-[#292524] border-stone-700'} flex flex-col items-center justify-center text-center`}>
      <div className="flex items-center gap-2 mb-1 opacity-70">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">{label}</span>
      </div>
      <span className={`text-2xl font-black font-[family-name:var(--font-cinzel)] ${highlight ? 'text-amber-400' : 'text-stone-200'}`}>
        {value}
      </span>
    </div>
  );
}

function TrophyIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
}