// src/lib/monster-factory.ts
import { EnemQuestion, Monster } from "@/types/game";

export function createMonsterFromQuestion(question: EnemQuestion): Monster {
  // 1. Define Dificuldade pelo tamanho do texto ("Textão" = Boss)
  const textLength = question.statement.length;
  let difficulty: Monster['difficulty'] = 'mob';
  let hp = 1;
  let maxHp = 1;

  if (textLength > 800) {
    difficulty = 'boss';
    hp = 3; 
    maxHp = 3;
  } else if (textLength > 400) {
    difficulty = 'elite';
    hp = 2; 
    maxHp = 2;
  }

  // 2. Define Categoria e Nome RPGístico
  // Mapeamento simples de disciplinas para temas
  const categoryMap: Record<string, string> = {
    'matematica': 'Torre da Lógica',
    'ciencias-natureza': 'Pântano Alquímico',
    'ciencias-humanas': 'Ruínas da História',
    'linguagens': 'Biblioteca Esquecida',
  };

  const theme = categoryMap[question.discipline] || 'Limbo do Conhecimento';

  // 3. Monta o Objeto Monstro
  return {
    id: question.id,
    name: `${theme} - ${difficulty.toUpperCase()}`, // Ex: "Torre da Lógica - BOSS"
    category: question.discipline,
    difficulty,
    hp,
    maxHp,
    fullText: question.statement,
    options: question.alternatives.map((alt, index) => {
      // Transforma índice 0, 1, 2 em "A", "B", "C"
      const letter = String.fromCharCode(65 + index); 
      return {
        id: letter,
        text: alt,
        isCorrect: letter === question.correctAlternative // A API já manda "A", "B"...
      };
    })
  };
}