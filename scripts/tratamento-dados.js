const fs = require('fs');
const path = require('path');

// Nomes dos seus arquivos baixados
const ARQUIVOS_ENTRADA = ['2022.jsonl', '2023.jsonl', '2024.jsonl'];
const ARQUIVO_SAIDA = 'src/data/questoes_limpas.json'; // Onde vai salvar

// Função auxiliar para mapear índice (0, 1, 2) para letra (A, B, C)
const getLetra = (index) => String.fromCharCode(65 + index);

async function processarDados() {
  let todasQuestoes = [];

  console.log('🏗️  Iniciando tratamento dos dados...');

  for (const arquivo of ARQUIVOS_ENTRADA) {
    const caminho = path.join(__dirname, arquivo);
    
    if (!fs.existsSync(caminho)) {
      console.warn(`⚠️  Arquivo ${arquivo} não encontrado. Pulando.`);
      continue;
    }

    console.log(`📂 Lendo ${arquivo}...`);
    
    const conteudo = fs.readFileSync(caminho, 'utf-8');
    // O segredo do JSONL: dividir por quebra de linha (\n) e filtrar linhas vazias
    const linhas = conteudo.split('\n').filter(linha => linha.trim() !== '');

    const questoesProcessadas = linhas.map((linha, index) => {
      try {
        const q = JSON.parse(linha);

        // Tratamento da Imagem: Pega a primeira da lista, se existir
        const imagem = (q.figures && q.figures.length > 0) ? q.figures[0] : null;

        // Limpeza do Enunciado (opcional: remove o placeholder de imagem)
        const enunciadoLimpo = q.question.replace('[[placeholder]]', '').trim();

        return {
          id: `${q.exam}_${q.id}`, // Cria um ID único (ex: 2022_questao_01)
          ano: parseInt(q.exam), // Converte "2022" para 2022 (Int)
          materia: "Geral", // O dataset não traz matéria separada, infelizmente
          enunciado: enunciadoLimpo,
          imagemUrl: imagem,
          respostaCorreta: q.label, // Já vem como "A", "B"...
          alternativas: q.alternatives.map((texto, i) => ({
            letra: getLetra(i),
            texto: texto
          }))
        };
      } catch (erro) {
        console.error(`❌ Erro na linha ${index} do arquivo ${arquivo}:`, erro.message);
        return null;
      }
    }).filter(item => item !== null); // Remove itens que deram erro

    todasQuestoes = [...todasQuestoes, ...questoesProcessadas];
  }

  // Cria a pasta se não existir
  const dir = path.dirname(ARQUIVO_SAIDA);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  // Salva o arquivo final
  fs.writeFileSync(ARQUIVO_SAIDA, JSON.stringify(todasQuestoes, null, 2));
  
  console.log(`\n✅ Sucesso! Total de questões processadas: ${todasQuestoes.length}`);
  console.log(`📁 Arquivo salvo em: ${ARQUIVO_SAIDA}`);
}

processarDados();