import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameDifficulty } from '@/types/game'; // Importe o tipo novo

interface GameState {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  difficulty: GameDifficulty; // Novo estado
  
  // Ações
  takeDamage: (amount: number) => void;
  addXp: (amount: number) => void;
  resetGame: () => void;
  setDifficulty: (diff: GameDifficulty) => void; // Nova ação
}

// Configuração de XP por Nível
const XP_TABLE = {
  easy: 50,    // 1 Acerto = Level Up (Modo Teste/Gratificação)
  medium: 300, // 6 Acertos = Level Up (Equilibrado)
  hard: 1000   // 20 Acertos = Level Up (Modo Vestibulando Real)
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // --- ESTADOS INICIAIS ---
      hp: 3,
      maxHp: 3,
      xp: 0,
      level: 1,
      difficulty: 'medium', // Começa no médio

      // --- AÇÕES ---
      
      setDifficulty: (diff) => set({ difficulty: diff }),

      takeDamage: (amount) => set((state) => {
        const newHp = state.hp - amount;
        if (newHp <= 0) return { hp: 0 };
        return { hp: newHp };
      }),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        
        // A Mágica: Calcula o XP necessário baseado na dificuldade escolhida
        const xpNeededBase = XP_TABLE[state.difficulty]; 
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

      resetGame: () => set((state) => ({
        hp: 3,
        xp: 0,
        level: 1,
        difficulty: state.difficulty // Mantém a dificuldade que o usuário escolheu
      }))
    }),
    {
      name: 'enem-dungeon-savegame',
    }
  )
);