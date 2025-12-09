# 🛡️ ENEM Dungeon

![Project Status](https://img.shields.io/badge/status-beta_2.0-purple)
![Tech Stack](https://img.shields.io/badge/stack-Next.js_14-black)
![Style](https://img.shields.io/badge/style-Tailwind_v4-cyan)
![License](https://img.shields.io/badge/license-MIT-blue)

> **Transformando a maratona do ENEM em uma jornada épica de RPG.**

<div align="center">
  <img src="public/logo.png" alt="Enem Dungeon Logo" width="250" />
</div>

## ⚔️ Sobre o Projeto

O **ENEM Dungeon** é uma plataforma de *Game Learning* que transforma o estudo para o vestibular em uma experiência de **Dungeon Crawler**.

Diferente de simulados tradicionais, aqui cada questão é um **Monólito** que deve ser decifrado. O sistema utiliza dados reais de provas anteriores (2022-2024), higienizados e servidos através de uma arquitetura desacoplada para máxima performance.

### 🌟 Destaques da Versão 2.0 (Visual Épico)
- **Visual High Fantasy:** Interface imersiva com texturas de pedra, pergaminho antigo e runas mágicas.
- **Sistema de Portais:** O jogador escolhe sua batalha entre 5 reinos (Matemática, Humanas, Natureza, Linguagens ou Caos).
- **Mecânica de RPG Real:**
  - **HP Dinâmico:** Dificuldades ajustáveis (Aprendiz/5❤️, Aventureiro/3❤️, Guardião/1❤️).
  - **XP & Level Up:** Barra de progresso com animações de vitória e chuva de confetes.
  - **Grimório:** Histórico persistente de batalhas (salvo no navegador).
- **Sonoplastia:** Feedback auditivo para ataques (acertos), danos (erros) e vitórias.
- **Engenharia de Dados:** Banco de questões hospedado externamente (GitHub Raw) para deploy leve e rápido.

---

## 🛠️ Tech Stack & Decisões Arquiteturais

Este projeto adota uma arquitetura **Serverless** moderna com foco em UX e Performance.

- **Core:** [Next.js 14](https://nextjs.org/) (App Router) + TypeScript.
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (Configuração via CSS Variables nativas e texturas procedurais).
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) com *Persist Middleware* (Save Game automático no LocalStorage).
- **Data Source:** JSON estático hospedado no **GitHub Raw**, consumido pela API do Next.js via `fetch` com cacheamento inteligente (`force-cache`).
- **UI/UX:** - `framer-motion` para animações fluidas.
  - `lucide-react` para iconografia.
  - `sonner` para feedbacks (Toasts).
  - `react-confetti` para celebrações.
  - `react-markdown` para renderização rica dos enunciados.

### 📂 Arquitetura de Pastas
```text
src/
├── app/
│   ├── api/monster/   # BFF que busca o JSON no GitHub e filtra os dados
│   └── page.tsx       # Lógica principal do Game Loop (Lobby <-> Batalha)
├── components/
│   └── game/          # Componentes isolados (BattleCard, LevelUpModal, Grimoire)
├── lib/
│   └── monster-factory.ts # Adapter Pattern: Transforma JSON bruto em Entidade de Jogo
├── store/
│   └── use-game-store.ts  # Cérebro do jogo (Lógica de XP, HP, Combo e Persistência)
└── hooks/             # Hooks customizados (ex: useGameSound para SFX)
🚀 Como Rodar Localmente
Pré-requisitos: Node.js 18+ instalado.

Clone o repositório

Bash

git clone [https://github.com/marcos-lima-dev/enem-dungeon.git](https://github.com/marcos-lima-dev/enem-dungeon.git)
cd enem-dungeon
Instale as dependências

Bash

npm install
Inicie o servidor

Bash

npm run dev
Acesse http://localhost:3000 e prepare-se para a batalha!

Nota: Não é necessário configurar variáveis de ambiente (.env) nem baixar arquivos JSON gigantes. A API conecta-se automaticamente ao banco de dados na nuvem.

🗺️ Roadmap & Status
[x] MVP: Loop principal de batalha (API -> Adapter -> Render).

[x] Engine: Sistema de Vida, XP, Combo e Level Up.

[x] UI Overhaul: Redesign completo para estilo "Dungeon" (Pedra/Pergaminho).

[x] Data: Migração do banco de dados local para GitHub Raw (Deploy leve).

[x] Audio: Implementação de SFX e feedbacks sonoros.

[x] Features: Seletor de Dificuldade, Menu de Categorias e Grimório.

[ ] Modo Boss: Questões complexas com mecânicas de tempo (Timer).

[ ] Leaderboard: Ranking global de jogadores (Integração com Supabase).

🤝 Contribuição
Este é um projeto Open Source focado em educação. Sugestões de design, novas mecânicas ou refatorações são bem-vindas!

Faça um Fork do projeto.

Crie uma Branch para sua Feature (git checkout -b feature/Incrível).

Faça o Commit (git commit -m 'Add some Incrível').

Faça o Push (git push origin feature/Incrível).

Abra um Pull Request.

👨‍💻 Autor
Desenvolvido por Marcos Lima. Focado em Front-End Engineering, UX Design e Arquitetura React.


### O que mudou:
1.  **Data Source:** Deixei claro que usamos **GitHub Raw** e não mais arquivos locais. Isso é importante para quem for clonar saber que não precisa baixar o JSON.
2.  **Status Beta 2.0:** Atualizei para refletir que o visual já é o novo.
3.  **Features:** Adicionei "Grimório" e "Sonoplastia" na lista de funcionalidades prontas.

Agora sim, documentação 100% alinhada com o código! 📝