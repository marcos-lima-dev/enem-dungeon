import { NextResponse } from 'next/server';
import { QuestaoLimpa } from '@/types/game';

// 🟢 URL DO SEU BANCO DE DADOS (GitHub Pages)
const EXTERNAL_DB_URL = 'https://marcos-lima-dev.github.io/enem-dungeon-db/questoes_limpas.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');

    // 1. Busca os dados na nuvem
    // 'force-cache' faz o Next.js guardar na memória (super rápido)
    // 'next: { revalidate: 3600 }' atualiza o cache a cada 1 hora se você mudar o JSON lá
    const response = await fetch(EXTERNAL_DB_URL, { 
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Erro ao baixar DB: ${response.status}`);
    }

    const bancoDeQuestoes: QuestaoLimpa[] = await response.json();

    // Filtro de Segurança (caso o JSON venha vazio)
    if (!bancoDeQuestoes || !Array.isArray(bancoDeQuestoes) || bancoDeQuestoes.length === 0) {
      return NextResponse.json({ error: 'Bestiário vazio ou inválido' }, { status: 500 });
    }

    // --- FILTRO DE QUALIDADE (Igual ao que tínhamos) ---
    // Remove questões quebradas (placeholder)
    const questoesValidas = bancoDeQuestoes.filter(q => {
       const temPlaceholder = q.alternativas.some(alt => 
         alt.texto.includes('[[placeholder]]') || alt.texto.trim() === ''
       );
       const enunciadoValido = q.enunciado && q.enunciado.length > 10;
       return !temPlaceholder && enunciadoValido;
    });

    let questoesFiltradas = questoesValidas;

    // 2. Filtra por Categoria
    if (categoria && categoria !== 'aleatorio') {
      questoesFiltradas = questoesFiltradas.filter(q => {
        const mat = q.materia ? q.materia.toLowerCase() : "";
        
        if (categoria === 'matematica') return mat.includes('matem');
        if (categoria === 'natureza') return mat.includes('natureza') || mat.includes('fisica') || mat.includes('quimica') || mat.includes('biologia');
        if (categoria === 'humanas') return mat.includes('humanas') || mat.includes('historia') || mat.includes('geografia') || mat.includes('filosofia') || mat.includes('sociologia');
        if (categoria === 'linguagens') return mat.includes('linguagens') || mat.includes('portugues') || mat.includes('arte') || mat.includes('ingles') || mat.includes('espanhol');
        
        return true;
      });
    }

    // Fallback: Se o filtro for muito específico e não achar nada, usa tudo
    if (questoesFiltradas.length === 0) {
      questoesFiltradas = questoesValidas;
    }

    // 3. Sorteio
    const indiceAleatorio = Math.floor(Math.random() * questoesFiltradas.length);
    const questaoSorteada = questoesFiltradas[indiceAleatorio];

    return NextResponse.json([questaoSorteada]);
    
  } catch (error) {
    console.error("Erro na masmorra:", error);
    return NextResponse.json({ error: 'Falha ao invocar monstro' }, { status: 500 });
  }
}