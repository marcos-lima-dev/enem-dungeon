import { create } from 'zustand';

interface GameState {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  
  // Ações (Métodos)
  takeDamage: (amount: number) => void;
  addXp: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Status Iniciais
  hp: 3,       // Começa com 3 corações
  maxHp: 3,
  xp: 0,
  level: 1,

  // Quando erra a questão
  takeDamage: (amount) => set((state) => {
    const newHp = state.hp - amount;
    
    if (newHp <= 0) {
      // Lógica de Game Over pode ser disparada aqui ou na UI
      return { hp: 0 }; 
    }
    
    return { hp: newHp };
  }),

  // Quando acerta a questão
  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const xpToNextLevel = state.level * 1000; // Ex: Nível 1 precisa de 1000, Nível 2 precisa de 2000...

    // Lógica de Level Up
    if (newXp >= xpToNextLevel) {
      return {
        xp: newXp - xpToNextLevel, // Sobra o XP excedente
        level: state.level + 1,
        hp: state.maxHp, // Cura total ao subir de nível! (Clássico de RPG)
      };
    }

    return { xp: newXp };
  }),

  // Reiniciar tudo (Botão "Tentar Novamente")
  resetGame: () => set({
    hp: 3,
    xp: 0,
    level: 1
  })
}));