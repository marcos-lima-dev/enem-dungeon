import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameDifficulty } from '@/types/game';

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
  history: BattleRecord[];
  
  takeDamage: (amount: number) => void;
  addXp: (amount: number) => void;
  resetGame: () => void;
  setDifficulty: (diff: GameDifficulty) => void;
  addToHistory: (record: Omit<BattleRecord, 'id' | 'timestamp'>) => void;
}

// CONFIGURAÇÃO DE BALANCEAMENTO ⚖️
const GAME_RULES = {
  easy:   { hp: 5, xpBase: 50 },   // 5 Vidas (Tanque)
  medium: { hp: 3, xpBase: 300 },  // 3 Vidas (Padrão)
  hard:   { hp: 1, xpBase: 1000 }  // 1 Vida (Hardcore)
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Estado Inicial (Padrão Médio)
      hp: 3,
      maxHp: 3,
      xp: 0,
      level: 1,
      difficulty: 'medium',
      history: [],

      // Ao mudar a dificuldade, já ajusta a vida máxima e cura o jogador
      setDifficulty: (diff) => {
        const rules = GAME_RULES[diff];
        set({ 
          difficulty: diff,
          maxHp: rules.hp,
          hp: rules.hp // Reseta a vida para o novo máximo
        });
      },

      takeDamage: (amount) => set((state) => {
        const newHp = state.hp - amount;
        if (newHp <= 0) return { hp: 0 };
        return { hp: newHp };
      }),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        
        // Busca a regra baseada na dificuldade ATUAL
        const xpNeededBase = GAME_RULES[state.difficulty].xpBase;
        const xpToNextLevel = state.level * xpNeededBase; 

        if (newXp >= xpToNextLevel) {
          return {
            xp: newXp - xpToNextLevel,
            level: state.level + 1,
            hp: state.maxHp, // Cura total ao subir de nível
          };
        }
        return { xp: newXp };
      }),

      addToHistory: (record) => set((state) => {
        const newEntry: BattleRecord = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          ...record
        };
        return { history: [newEntry, ...state.history].slice(0, 50) };
      }),

      // Ao reiniciar, respeita a dificuldade que estava selecionada
      resetGame: () => {
        const currentDifficulty = get().difficulty;
        const rules = GAME_RULES[currentDifficulty];
        
        set({
          hp: rules.hp,
          maxHp: rules.hp,
          xp: 0,
          level: 1,
          difficulty: currentDifficulty
        });
      }
    }),
    {
      name: 'enem-dungeon-savegame',
    }
  )
);