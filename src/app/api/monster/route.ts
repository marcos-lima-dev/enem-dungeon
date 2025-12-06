import { NextResponse } from 'next/server';
// O Next.js permite importar JSON diretamente. Isso carrega os dados na memória do servidor.
import bancoDeQuestoes from '@/data/questoes_limpas.json'; 

export async function GET() {
  try {
    // 1. Verifica se temos questões
    if (!bancoDeQuestoes || bancoDeQuestoes.length === 0) {
      return NextResponse.json(
        { error: 'O bestiário está vazio! Rode o script de tratamento.' },
        { status: 500 }
      );
    }

    // 2. Sorteia um índice aleatório baseada no tamanho do array
    const indiceAleatorio = Math.floor(Math.random() * bancoDeQuestoes.length);
    const questaoSorteada = bancoDeQuestoes[indiceAleatorio];

    // 3. Retorna como array (para manter compatibilidade com seu front que espera array)
    return NextResponse.json([questaoSorteada]);
    
  } catch (error) {
    console.error("Erro na masmorra:", error);
    return NextResponse.json(
      { error: 'Falha ao invocar monstro' },
      { status: 500 }
    );
  }
}