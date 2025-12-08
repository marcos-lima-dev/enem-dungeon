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
  streak: number; // <--- NOVO: Contador de sequência
  history: BattleRecord[];
  
  takeDamage: (amount: number) => void;
  // Nova função poderosa que substitui o addXp simples
  registerCorrectAnswer: () => { leveledUp: boolean, healed: boolean }; 
  resetGame: () => void;
  setDifficulty: (diff: GameDifficulty) => void;
  addToHistory: (record: Omit<BattleRecord, 'id' | 'timestamp'>) => void;
}

const GAME_RULES = {
  easy:   { hp: 5, xpBase: 50 },
  medium: { hp: 3, xpBase: 300 },
  hard:   { hp: 1, xpBase: 1000 }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hp: 3,
      maxHp: 3,
      xp: 0,
      level: 1,
      difficulty: 'medium',
      streak: 0, // Começa zerado
      history: [],

      setDifficulty: (diff) => {
        const rules = GAME_RULES[diff];
        // Reseta tudo ao mudar dificuldade
        set({ difficulty: diff, maxHp: rules.hp, hp: rules.hp, streak: 0 });
      },

      takeDamage: (amount) => set((state) => {
        const newHp = state.hp - amount;
        return { 
          hp: newHp <= 0 ? 0 : newHp,
          streak: 0 // <--- ERROU? O COMBO ZERA!
        };
      }),

      // AÇÃO DE ACERTO (CÉREBRO DO COMBO)
      registerCorrectAnswer: () => {
        const state = get();
        const rules = GAME_RULES[state.difficulty];
        
        let newXp = state.xp + rules.xpBase;
        let newLevel = state.level;
        let newHp = state.hp;
        let newStreak = state.streak + 1; // Aumenta o combo
        
        let leveledUp = false;
        let healed = false;

        // 1. Checa Level Up
        const xpToNextLevel = state.level * rules.xpBase; 
        if (newXp >= xpToNextLevel) {
          newXp = newXp - xpToNextLevel;
          newLevel += 1;
          newHp = state.maxHp; // Level up cura tudo
          leveledUp = true;
          healed = true;
        } 
        // 2. Checa Combo de Cura (A cada 3 acertos)
        // Só cura se não estiver de vida cheia
        else if (newStreak % 3 === 0 && newHp < state.maxHp) {
          newHp += 1;
          healed = true;
        }

        set({
          xp: newXp,
          level: newLevel,
          hp: newHp,
          streak: newStreak
        });

        // Retorna o que aconteceu para a interface avisar o usuário
        return { leveledUp, healed };
      },

      addToHistory: (record) => set((state) => {
        const newEntry: BattleRecord = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          ...record
        };
        return { history: [newEntry, ...state.history].slice(0, 50) };
      }),

      resetGame: () => {
        const state = get();
        const rules = GAME_RULES[state.difficulty];
        set({ hp: rules.hp, maxHp: rules.hp, xp: 0, level: 1, streak: 0 });
      }
    }),
    { name: 'enem-dungeon-savegame' }
  )
);