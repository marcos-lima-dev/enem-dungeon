// Estrutura do arquivo src/data/questoes_limpas.json
export interface QuestaoLimpa {
  id: string;
  ano: number;
  materia: string;
  enunciado: string;
  imagemUrl?: string | null;
  respostaCorreta: string; // "A", "B", "C", "D", "E"
  alternativas: {
    letra: string;
    texto: string;
  }[];
}

// Estrutura usada pelo Front-end (O Monstro da Dungeon)
export interface Monster {
  id: string;
  name: string;
  category: string;
  difficulty: 'mob' | 'elite' | 'boss';
  hp: number;
  maxHp: number;
  fullText: string;
  imageUrl?: string | null;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}