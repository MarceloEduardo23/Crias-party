# Crias Party 🎉 — Guia rápido

## O que foi adicionado

- **Modo Festa**: botão "🎉 Modo Festa" no lobby inicia 3 rodadas com jogos
  sorteados aleatoriamente entre Vinte e Um, Impostor e Quiz. Entre rodadas
  aparece uma tela de **ranking**, e no final um pódio com o vencedor.
- **Impostor com imagens de animais**: a cada rodada, um animal é sorteado
  (20 animais cadastrados em `lib/animals.ts`) e a foto aparece na TV e no
  celular de todo mundo. Todo jogador recebe o **nome** do animal — exceto o
  impostor, que só vê a foto sem saber o nome.
- **Quiz**: novo minigame com 36 perguntas cadastradas (`lib/quiz-questions.ts`)
  em 5 categorias (Brasil, Pop, Ciência, Esportes, Curiosidades). Cada rodada
  de quiz sorteia 5 perguntas, com 20s por pergunta e pontos para quem acerta.
- **Ranking**: tela de placar com pódio entre rodadas e no fim do jogo.
- **Painel Admin** (`/admin`): senha padrão `crias-admin-2024` (troque via
  variável de ambiente `ADMIN_SECRET`). Mostra todas as salas ativas, jogadores,
  placares, e permite iniciar o Modo Festa, forçar um jogo específico, zerar
  pontuação ou deletar uma sala remotamente.
- **Nova fonte**: troquei Fredoka/Nunito por **Boogaloo** (títulos, mais
  bombástica e divertida) + **Poppins** (textos, mais moderna e legível).

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador do "telão" (TV/notebook) e crie uma
sala. Os celulares entram pelo código de 4 letras.

## Como publicar online (Vercel — recomendado)

1. Crie uma conta gratuita em vercel.com e instale a CLI:
   ```bash
   npm i -g vercel
   ```
2. Dentro da pasta do projeto:
   ```bash
   vercel
   ```
   Siga as perguntas (aceite os padrões). Em poucos minutos você recebe uma
   URL pública tipo `crias-party.vercel.app`.
3. Para deploy de produção definitivo:
   ```bash
   vercel --prod
   ```
4. (Opcional) Defina uma senha de admin própria: no painel da Vercel, vá em
   **Settings → Environment Variables** e adicione `ADMIN_SECRET` com o valor
   que você quiser. Redeploy depois de salvar.

> **Sobre persistência das salas**: o estado das salas (jogadores, placar,
> jogo em andamento) ainda fica na memória do processo Node, não no banco —
> isso é ótimo para jogar numa festa, mas significa que se o servidor
> reiniciar (ex: novo deploy), as salas ativas no momento são perdidas. As
> *perguntas de quiz e itens do impostor*, por outro lado, já são
> persistentes (ver seção abaixo). Mover o estado das salas para o banco
> também é possível depois, se fizer sentido pro seu caso de uso.

## Banco de dados (perguntas do Quiz e itens do Impostor)

As perguntas do Quiz e os itens do Impostor (animais, comidas, lugares etc)
ficam num **banco SQLite real**, acessado via `@libsql/client` — não mais em
arquivos de código. Você cria, edita, ativa/desativa e exclui perguntas e
itens direto pelo painel `/admin`, sem precisar editar nenhum código.

- Em **desenvolvimento** (sem nenhuma configuração extra), o banco vira um
  arquivo local em `data/crias-party.db`, criado e populado automaticamente
  na primeira execução com todo o conteúdo que já existia (38 perguntas de
  quiz, 55 itens de impostor incluindo os 20 animais com foto).
- Em **produção**, configure um banco [Turso](https://turso.tech) (SQLite
  hospedado, com plano gratuito generoso) para que os dados persistam entre
  deploys e funcionem corretamente em ambiente serverless — veja o passo a
  passo abaixo.
- No painel admin (`/admin`), tem três abas: **Salas**, **Quiz** e
  **Impostor**. Nas duas últimas você cadastra, edita e desativa conteúdo
  livremente.

### Configurando o Turso para produção

1. Crie uma conta gratuita em [turso.tech](https://turso.tech) e instale a CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
2. Faça login e crie um banco:
   ```bash
   turso auth login
   turso db create crias-party
   ```
3. Pegue a URL de conexão e gere um token de acesso:
   ```bash
   turso db show crias-party --url
   turso db tokens create crias-party
   ```
4. Configure essas duas variáveis de ambiente (veja `.env.example`):
   - `TURSO_DATABASE_URL` — a URL do passo anterior (formato `libsql://...`)
   - `TURSO_AUTH_TOKEN` — o token gerado
   - Na Vercel: **Settings → Environment Variables**, adicione as duas e
     faça o redeploy.
5. No primeiro acesso ao app já configurado com Turso, o seed automático
   roda normalmente e popula o banco hospedado com o conteúdo inicial.

Sem essas variáveis configuradas, o app continua funcionando perfeitamente
em desenvolvimento local (cai automaticamente no arquivo SQLite local) — elas
só são necessárias quando for para produção de verdade.


## Próximos passos sugeridos

- Mover o estado das salas (jogadores, placar, jogo atual) para o mesmo
  banco Turso ou para Redis — hoje ainda vive em memória do processo Node.
- Trocar as imagens de animais por fotos hospedadas no próprio domínio (hoje
  usamos Wikimedia Commons) para não depender de terceiros.

