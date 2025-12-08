import { NextResponse } from 'next/server';
import { QuestaoLimpa } from '@/types/game';

// URL do seu Banco de Dados (GitHub Raw)
const EXTERNAL_DB_URL = 'https://raw.githubusercontent.com/marcos-lima-dev/enem-dungeon-db/main/questoes_limpas.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');

    // 1. Busca os dados na nuvem
    // 'force-cache' orienta o Next.js a guardar isso em cache para ser rápido
    const response = await fetch(EXTERNAL_DB_URL, { cache: 'force-cache' });

    if (!response.ok) {
      throw new Error(`Erro ao baixar DB: ${response.status}`);
    }

    const bancoDeQuestoes: QuestaoLimpa[] = await response.json();

    if (!bancoDeQuestoes || bancoDeQuestoes.length === 0) {
      return NextResponse.json({ error: 'Bestiário vazio' }, { status: 500 });
    }

    let questoesFiltradas = bancoDeQuestoes;

    // 2. Filtra por Matéria (Mesma lógica de antes)
    if (categoria && categoria !== 'aleatorio') {
      questoesFiltradas = bancoDeQuestoes.filter(q => {
        const mat = q.materia ? q.materia.toLowerCase() : "";
        
        if (categoria === 'matematica') return mat.includes('matem');
        if (categoria === 'natureza') return mat.includes('natureza') || mat.includes('fisica') || mat.includes('quimica') || mat.includes('biologia');
        if (categoria === 'humanas') return mat.includes('humanas') || mat.includes('historia') || mat.includes('geografia') || mat.includes('filosofia') || mat.includes('sociologia');
        if (categoria === 'linguagens') return mat.includes('linguagens') || mat.includes('portugues') || mat.includes('arte') || mat.includes('ingles') || mat.includes('espanhol');
        
        return true;
      });
    }

    // Se o filtro for muito restrito, usa o banco todo como fallback
    if (questoesFiltradas.length === 0) {
      questoesFiltradas = bancoDeQuestoes;
    }

    // 3. Sorteia um monstro
    const indiceAleatorio = Math.floor(Math.random() * questoesFiltradas.length);
    const questaoSorteada = questoesFiltradas[indiceAleatorio];

    return NextResponse.json([questaoSorteada]);
    
  } catch (error) {
    console.error("Erro na masmorra:", error);
    return NextResponse.json({ error: 'Falha ao invocar monstro' }, { status: 500 });
  }
}