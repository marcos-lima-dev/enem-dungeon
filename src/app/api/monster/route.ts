import { NextResponse } from 'next/server';
import bancoDeQuestoes from '@/data/questoes_limpas.json';
import { QuestaoLimpa } from '@/types/game';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria'); // Pega o filtro da URL

    if (!bancoDeQuestoes || bancoDeQuestoes.length === 0) {
      return NextResponse.json({ error: 'Bestiário vazio' }, { status: 500 });
    }

    let questoesFiltradas = bancoDeQuestoes as QuestaoLimpa[];

    // Lógica de Filtro
    if (categoria && categoria !== 'aleatorio') {
      questoesFiltradas = questoesFiltradas.filter(q => {
        const mat = q.materia ? q.materia.toLowerCase() : "";
        
        // Mapeamento dos botões para as strings do JSON
        if (categoria === 'matematica') return mat.includes('matem');
        if (categoria === 'natureza') return mat.includes('natureza') || mat.includes('fisica') || mat.includes('quimica') || mat.includes('biologia');
        if (categoria === 'humanas') return mat.includes('humanas') || mat.includes('historia') || mat.includes('geografia') || mat.includes('filosofia') || mat.includes('sociologia');
        if (categoria === 'linguagens') return mat.includes('linguagens') || mat.includes('portugues') || mat.includes('arte') || mat.includes('ingles') || mat.includes('espanhol');
        
        return true;
      });
    }

    // Se o filtro for muito restrito e não sobrar nada, volta pro aleatório
    if (questoesFiltradas.length === 0) {
      questoesFiltradas = bancoDeQuestoes as QuestaoLimpa[];
    }

    // Sorteio
    const indiceAleatorio = Math.floor(Math.random() * questoesFiltradas.length);
    const questaoSorteada = questoesFiltradas[indiceAleatorio];

    return NextResponse.json([questaoSorteada]);
    
  } catch (error) {
    console.error("Erro na masmorra:", error);
    return NextResponse.json({ error: 'Falha ao invocar monstro' }, { status: 500 });
  }
}