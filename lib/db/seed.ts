import { ensureSchema } from './client'
import { ANIMALS } from '../animals'
import { WORD_PAIRS } from '../impostor-words'
import { QUIZ_QUESTIONS } from '../quiz-questions'
import { countQuizQuestions, createQuizQuestion } from './quiz-repository'
import { countImpostorItems, createImpostorItem } from './impostor-repository'

/**
 * Popula o banco com o conteúdo que antes vivia em arquivos estáticos.
 * Seguro de rodar mais de uma vez: só insere se as tabelas estiverem vazias.
 */
export async function seedDatabase() {
  await ensureSchema()

  if ((await countQuizQuestions()) === 0) {
    for (const q of QUIZ_QUESTIONS) {
      await createQuizQuestion({
        question: q.question,
        options: q.options as [string, string, string, string],
        correctIndex: q.correctIndex,
        category: q.category,
      })
    }
    console.log(`[seed] ${QUIZ_QUESTIONS.length} perguntas de quiz inseridas`)
  }

  if ((await countImpostorItems()) === 0) {
    for (const animal of ANIMALS) {
      await createImpostorItem({
        name: animal.name,
        category: 'Animais',
        emoji: animal.emoji,
        imageUrl: animal.imageUrl,
      })
    }
    for (const pair of WORD_PAIRS) {
      await createImpostorItem({
        name: pair.word,
        category: pair.category,
        emoji: pair.emoji,
        imageUrl: pair.imageUrl,
      })
    }
    console.log(
      `[seed] ${ANIMALS.length + WORD_PAIRS.length} itens de impostor inseridos`,
    )
  }
}

// Permite rodar via `npx tsx lib/db/seed.ts` standalone
if (require.main === module) {
  seedDatabase()
    .then(() => console.log('Seed concluído.'))
    .catch((err) => {
      console.error('Erro no seed:', err)
      process.exit(1)
    })
}
