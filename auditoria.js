// auditoria.js
const URL_BANCO = 'https://raw.githubusercontent.com/marcos-lima-dev/enem-dungeon-db/main/questoes_limpas.json';

async function auditar() {
  console.log('⏳ Baixando banco de dados do GitHub...');
  
  try {
    const res = await fetch(URL_BANCO);
    if (!res.ok) throw new Error(res.statusText);
    
    const dados = await res.json();
    
    // O mesmo filtro que usamos no jogo
    const bichadas = dados.filter(q => {
      const temPlaceholder = q.alternativas.some(alt => 
         alt.texto.includes('[[placeholder]]') || alt.texto.trim() === ''
      );
      const enunciadoRuim = !q.enunciado || q.enunciado.length < 10;
      
      return temPlaceholder || enunciadoRuim;
    });

    const total = dados.length;
    const ruins = bichadas.length;
    const boas = total - ruins;
    const perda = ((ruins / total) * 100).toFixed(1);

    console.log('\n📋 RELATÓRIO DE INTEGRIDADE:');
    console.log('--------------------------------');
    console.log(`📦 Total de Questões:   ${total}`);
    console.log(`✅ Questões Válidas:    ${boas}`);
    console.log(`🚫 Questões "Bichadas": ${ruins}`);
    console.log(`📉 Taxa de Perda:       ${perda}%`);
    console.log('--------------------------------');
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

auditar();