import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // <--- O segredo está aqui

interface GameState {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  
  // Ações
  takeDamage: (amount: number) => void;
  addXp: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // --- ESTADOS INICIAIS ---
      hp: 3,
      maxHp: 3,
      xp: 0,
      level: 1,

      // --- AÇÕES ---
      
      takeDamage: (amount) => set((state) => {
        const newHp = state.hp - amount;
        // Se zerar a vida, não deixa ficar negativo
        if (newHp <= 0) return { hp: 0 };
        return { hp: newHp };
      }),

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        // Regra de Nível: Nível * 50 de XP para subir (Modo Fácil para testes)
        const xpToNextLevel = state.level * 50; 

        if (newXp >= xpToNextLevel) {
          return {
            xp: newXp - xpToNextLevel, // O XP sobra para o próximo nível
            level: state.level + 1,
            hp: state.maxHp, // Cura total ao subir de nível
          };
        }

        return { xp: newXp };
      }),

      resetGame: () => set({
        hp: 3,
        xp: 0,
        level: 1
      })
    }),
    {
      name: 'enem-dungeon-savegame', // O nome da chave no navegador
    }
  )
);