import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameDifficulty } from '@/types/game';

// Definindo o formato do registro de batalha
export interface BattleRecord {
  id: string;
  questionId: string;
  category: string;
  isCorrect: boolean;
  timestamp: number;
}

interface GameState {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  difficulty: GameDifficulty;
  history: BattleRecord[]; // <--- NOVO: Histórico
  
  // Ações
  takeDamage: (amount: number) => void;
  addXp: (amount: number) => void;
  resetGame: () => void;
  setDifficulty: (diff: GameDifficulty) => void;
  addToHistory: (record: Omit<BattleRecord, 'id' | 'timestamp'>) => void; // <--- NOVA AÇÃO
}

const XP_TABLE = {
  easy: 50,
  medium: 300,
  hard: 1000
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      hp: 3,
      maxHp: 3,
      xp: 0,
      level: 1,
      difficulty: 'medium',
      history: [], // Começa vazio

      setDifficulty: (diff) => set({ difficulty: diff }),

      takeDamage: (amount) => set((state) => {
        const newHp = state.hp - amount;
        if (newHp <= 0) return { hp: 0 };
        return { hp: newHp };
      }),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const xpNeededBase = XP_TABLE[state.difficulty]; 
        const xpToNextLevel = state.level * xpNeededBase; 

        if (newXp >= xpToNextLevel) {
          return {
            xp: newXp - xpToNextLevel,
            level: state.level + 1,
            hp: state.maxHp,
          };
        }
        return { xp: newXp };
      }),

      // NOVA FUNÇÃO: Grava a batalha
      addToHistory: (record) => set((state) => {
        const newEntry: BattleRecord = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          ...record
        };
        // Guarda apenas os últimos 50 registros para não pesar
        return { history: [newEntry, ...state.history].slice(0, 50) };
      }),

      resetGame: () => set((state) => ({
        hp: 3,
        xp: 0,
        level: 1,
        difficulty: state.difficulty,
        // Nota: Não limpamos o histórico aqui propositalmente, 
        // para o jogador ver seu progresso global. 
        // Se quiser limpar, adicione: history: []
      }))
    }),
    {
      name: 'enem-dungeon-savegame',
    }
  )
);