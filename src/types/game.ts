// src/types/game.ts

// O formato exato que vem da API do yunger7
export interface EnemQuestion {
  id: string;
  examId: string;
  index: number; // Número da questão na prova
  title: string; // Ex: "Questão 136 - ENEM 2023"
  discipline: string; // Ex: "matematica", "linguagens"
  statement: string; // O enunciado (pode conter HTML/Markdown)
  correctAlternative: string; // "A", "B", "C", "D" ou "E"
  alternativesIntroduction?: string; // Texto antes das alternativas
  alternatives: string[]; // Array com os textos das opções
  files: string[]; // URLs de imagens (vamos ignorar por enquanto)
}

// O formato que seu Jogo vai usar (O Monstro)
export interface Monster {
  id: string;
  name: string;      // Nome RPGístico (Ex: "Goblin de Crase")
  category: string;  // A disciplina
  difficulty: 'mob' | 'elite' | 'boss';
  hp: number;        // Vidas do monstro
  maxHp: number;     // Para a barra de progresso
  fullText: string;
  options: {
    id: string;      // "A", "B"...
    text: string;
    isCorrect: boolean; // OBS: No frontend guardamos isso, mas só checamos no click
  }[];
}

// O Loot que o Ollama vai gerar depois
export interface LootItem {
  name: string;
  description: string;
  rarity: 'comum' | 'raro' | 'lendario';
  icon: string; // Nome do ícone do Lucide (string)
}