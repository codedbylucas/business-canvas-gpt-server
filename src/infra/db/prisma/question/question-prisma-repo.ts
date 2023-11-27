import type { QuestionModel } from '@/domain/models/db-models'
import type { AddManyQuestionsRepo, FetchAllQuestionsRepo } from '@/interactions/contracts/db'
import { PrismaHelper as prisma } from '../helpers/prisma-helper'
import type { QuestionFieldType as PrismaQuestionFieldType } from '@prisma/client'

export class QuestionPrismaRepo implements AddManyQuestionsRepo, FetchAllQuestionsRepo {
  async addMany (data: QuestionModel[]): Promise<void> {
    const prismaCli = await prisma.getCli()
    const questions = data.map(({ id, content, type }) => {
      let fieldType = type as PrismaQuestionFieldType
      if (type === 'text-area') {
        fieldType = 'text_area'
      }
      return { id, content, type: fieldType }
    })
    await prismaCli.question.createMany({ data: questions })
    for (const { alternatives } of data) {
      if (alternatives && alternatives.length > 0) {
        await prismaCli.alternative.createMany({ data: alternatives })
      }
    }
  }

  async fetchAll (): Promise<QuestionModel[]> {
    const prismaCli = await prisma.getCli()
    const questions = await prismaCli.question.findMany({
      include: { Alternative: true }
    })
    const questionsMap: QuestionModel[] = questions.map((question) => ({
      id: question.id,
      content: question.content,
      ...(question.type === 'text_area' ? { type: 'text-area' } : { type: question.type }),
      ...(question.Alternative.length > 0 && { alternatives: question.Alternative })
    }))
    return questionsMap
  }
}
