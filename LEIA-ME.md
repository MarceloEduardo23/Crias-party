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
ficam num **banco Postgres real**, hospedado no **Neon**, acessado via
`@neondatabase/serverless` — não mais em arquivos de código. Você cria,
edita, ativa/desativa e exclui perguntas e itens direto pelo painel
`/admin`, sem precisar editar nenhum código.

- Sem `DATABASE_URL` configurada, o app cai automaticamente num banco em
  memória (já pré-populado com o conteúdo inicial), só para não travar o
  desenvolvimento antes de você configurar o Neon — mas isso **não persiste**
  entre reinícios.
- Com `DATABASE_URL` configurada, conecta de fato no Neon: os dados
  persistem entre deploys e funcionam corretamente em ambiente serverless
  (a Vercel, onde seu site já está hospedado, é serverless e tem o
  filesystem somente-leitura — por isso um banco hospedado é necessário
  para persistência real).
- No painel admin (`/admin`), tem três abas: **Salas**, **Quiz** e
  **Impostor**. Nas duas últimas você cadastra, edita e desativa conteúdo
  livremente.

### Configurando o Neon e conectando na Vercel (seu site já hospedado)

1. Crie uma conta gratuita em [neon.tech](https://neon.tech) e crie um
   projeto novo (pode chamar de `crias-party`).
2. No painel do Neon, vá em **Connection Details** e copie a *connection
   string* (algo como `postgresql://usuario:senha@ep-xxxxx.neon.tech/neondb?sslmode=require`).
3. Como seu site já está na Vercel, é só adicionar a variável lá:
   - Acesse [vercel.com](https://vercel.com) → seu projeto → **Settings →
     Environment Variables**.
   - Adicione uma variável chamada `DATABASE_URL` com o valor da connection
     string copiada no passo 2.
   - Marque para os ambientes **Production**, **Preview** e **Development**
     (ou pelo menos Production).
   - Clique em **Save**.
4. Force um novo deploy para a variável entrar em vigor: na aba
   **Deployments**, nos três pontinhos do último deploy, clique em
   **Redeploy** (ou simplesmente faça um novo `git push`).
5. No primeiro acesso ao site já com `DATABASE_URL` configurada, o app cria
   automaticamente as tabelas no Neon e popula com o conteúdo inicial (38
   perguntas de quiz, 55 itens de impostor). Você pode confirmar acessando
   `/admin` e olhando as abas Quiz/Impostor.

### Rodando localmente com o mesmo banco do Neon (opcional)

Se quiser testar localmente já conectado ao Neon (em vez do fallback em
memória), crie um arquivo `.env.local` na raiz do projeto (baseado no
`.env.example`) com a mesma `DATABASE_URL`:

```bash
DATABASE_URL=postgresql://usuario:senha@ep-xxxxx.neon.tech/neondb?sslmode=require
```

Sem esse arquivo, `npm run dev` continua funcionando normalmente com o
fallback em memória — útil para testar rapidamente sem afetar os dados de
produção no Neon.

## Próximos passos sugeridos

- Mover o estado das salas (jogadores, placar, jogo atual) para o mesmo
  banco Neon ou para Redis — hoje ainda vive em memória do processo Node.
- Trocar as imagens de animais por fotos hospedadas no próprio domínio (hoje
  usamos Wikimedia Commons) para não depender de terceiros.

