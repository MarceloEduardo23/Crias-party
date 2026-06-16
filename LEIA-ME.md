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

## Próximos passos sugeridos

- Adicionar mais perguntas de quiz pelo admin (hoje só dá pra editar o arquivo
  `lib/quiz-questions.ts` direto no código — um CRUD de perguntas no painel
  admin seria o próximo upgrade natural).
- Trocar as imagens de animais por fotos hospedadas no próprio domínio (hoje
  usamos Wikimedia Commons) para não depender de terceiros.
- Persistência em Redis/banco para sobreviver a reinícios do servidor.
