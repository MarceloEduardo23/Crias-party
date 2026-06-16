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

> **Atenção**: o estado das salas fica na memória do processo Node (não há
> banco de dados). Isso é ótimo para jogar em uma festa, mas significa que se
> o servidor reiniciar (ex: novo deploy), todas as salas ativas são perdidas.
> Para um uso mais robusto (ex: adaptação educacional com múltiplas turmas
> simultâneas por muito tempo), o próximo passo seria mover o estado para
> Redis ou um banco de dados.

## Banco de dados (perguntas do Quiz e itens do Impostor)

Agora as perguntas do Quiz e os itens do Impostor (animais, comidas, lugares
etc) ficam num **banco SQLite real** (`data/crias-party.db`), não mais em
arquivos de código. Isso significa que você pode criar, editar, ativar/desativar
e excluir perguntas e itens direto pelo painel `/admin`, sem precisar editar
nenhum código.

- Na primeira vez que o servidor rodar, o banco é criado automaticamente e
  populado com todo o conteúdo que já existia (38 perguntas de quiz, 55 itens
  de impostor incluindo os 20 animais com foto).
- Usamos o módulo nativo `node:sqlite` do Node.js (disponível a partir da
  versão 22.5) — não depende de nenhum pacote externo nem de compilação,
  então funciona em qualquer lugar sem configuração extra.
- No painel admin (`/admin`), agora tem três abas: **Salas**, **Quiz** e
  **Impostor**. Nas duas últimas você cadastra, edita e desativa conteúdo
  livremente.

### ⚠️ Atenção se for hospedar na Vercel (ou qualquer serverless)

A Vercel roda funções em um sistema de arquivos **somente leitura** (exceto
`/tmp`, que é temporário e não persiste). Isso quer dizer que o arquivo
`data/crias-party.db` **não vai persistir entre deploys nem entre instâncias**
se você rodar assim "puro" na Vercel — toda vez que uma função reiniciar, o
banco volta ao estado inicial (com o seed de novo).

Para produção de verdade, a solução recomendada é trocar o SQLite local por
um banco de dados hospedado, mantendo praticamente a mesma estrutura de
código (`lib/db/quiz-repository.ts` e `lib/db/impostor-repository.ts` já
isolam todo o acesso a dados — só precisa trocar a implementação interna):

- **Turso** (SQLite distribuído, plano gratuito generoso, API bem parecida
  com o que já está aqui) — provavelmente a migração mais simples.
- **Neon** ou **Supabase** (Postgres gerenciado, planos gratuitos disponíveis).
- **Vercel Postgres** (se quiser manter tudo dentro do ecossistema Vercel).

Se quiser, no próximo passo eu já adapto os repositórios para um desses
serviços — é só avisar qual prefere.

## Próximos passos sugeridos

- Migrar o SQLite local para um banco hospedado (Turso/Neon/Supabase) antes
  de ir pra produção de verdade — ver aviso acima.
- Mover o estado das salas (jogadores, placar, jogo atual) para Redis ou
  esse mesmo banco, hoje ainda vive em memória do processo Node.
- Trocar as imagens de animais por fotos hospedadas no próprio domínio (hoje
  usamos Wikimedia Commons) para não depender de terceiros.

