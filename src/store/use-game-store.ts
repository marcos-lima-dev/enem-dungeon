import { create } from 'zustand';
import { Monster, LootItem } from '@/types/game';

interface GameState {
  // Estado do Jogador
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  inventory: LootItem[];
  
  // Estado da Batalha Atual
  currentMonster: Monster | null;
  isCombatActive: boolean;

  // Ações (O que o jogo pode fazer)
  setMonster: (monster: Monster) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addXp: (amount: number) => void;
  addToInventory: (item: LootItem) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Valores Iniciais
  hp: 3,        // 3 Corações clássicos
  maxHp: 3,
  xp: 0,
  level: 1,
  inventory: [],
  currentMonster: null,
  isCombatActive: false,

  // Implementação das Ações
  setMonster: (monster) => set({ 
    currentMonster: monster, 
    isCombatActive: true 
  }),

  takeDamage: (amount) => set((state) => {
    const newHp = state.hp - amount;
    // Se HP zerar, game over (lógica futura)
    return { hp: Math.max(0, newHp) };
  }),

  heal: (amount) => set((state) => ({ 
    hp: Math.min(state.maxHp, state.hp + amount) 
  })),

  addXp: (amount) => set((state) => {
    // Lógica simples de Level Up: a cada 100xp sobe de nível
    const newXp = state.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;
    return { xp: newXp, level: newLevel };
  }),

  addToInventory: (item) => set((state) => ({ 
    inventory: [...state.inventory, item] 
  })),

  resetGame: () => set({ 
    hp: 3, 
    xp: 0, 
    level: 1, 
    inventory: [], 
    isCombatActive: false 
  })
}));