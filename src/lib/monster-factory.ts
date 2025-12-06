import { Monster, QuestaoLimpa } from "@/types/game";

export function createMonsterFromQuestion(data: any): Monster {
  // Forçamos a tipagem para o formato que vem do JSON
  const q = data as QuestaoLimpa;

  // Proteção contra dados vazios
  if (!q) {
    throw new Error("Monstro inválido (Dados vazios)");
  }

  // 1. Dificuldade e HP
  const textLength = q.enunciado ? q.enunciado.length : 0;
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

  // 2. Tema e Categoria
  const materia = q.materia ? q.materia.toLowerCase() : "";
  let theme = 'Limbo do Conhecimento';

  if (materia.includes('matem')) theme = 'Torre da Lógica';
  else if (materia.includes('natureza') || materia.includes('fisica') || materia.includes('quimica') || materia.includes('biologia')) theme = 'Pântano Alquímico';
  else if (materia.includes('humanas') || materia.includes('historia') || materia.includes('geografia') || materia.includes('filosofia')) theme = 'Ruínas da História';
  else if (materia.includes('linguagens') || materia.includes('portugues') || materia.includes('arte')) theme = 'Biblioteca Esquecida';

  // 3. Montagem do Monstro
  // CORREÇÃO AQUI: Usar q.alternativas (Português) em vez de q.alternatives
  const options = q.alternativas ? q.alternativas.map((alt) => ({
    id: alt.letra,
    text: alt.texto,
    isCorrect: alt.letra === q.respostaCorreta 
  })) : [];

  return {
    id: q.id,
    name: `${theme} - ${difficulty.toUpperCase()}`,
    category: theme,
    difficulty,
    hp,
    maxHp,
    fullText: q.enunciado,
    imageUrl: q.imagemUrl,
    options: options
  };
}