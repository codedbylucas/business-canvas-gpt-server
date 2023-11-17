import type { AddManyAnswersRepo, AddManyAnswersRepoDto } from '@/interactions/contracts/db'
import type { Prisma } from '@prisma/client'
import { PrismaHelper } from '../helpers/prisma-helper'

export class AnswerPrismaRepo implements AddManyAnswersRepo {
  async add (dto: AddManyAnswersRepoDto): Promise<void> {
    const { userId, answers } = dto
    const prisma = await PrismaHelper.getCli()
    const data: Prisma.AnswerCreateManyInput[] = answers.map(answer => ({
      id: answer.id,
      createdAt: answer.createdAt,
      userId,
      questionId: answer.questionId,
      ...(answer.alternativeId && { alternativeId: answer.alternativeId }),
      ...(answer.description && { description: answer.description })
    }))
    await prisma.answer.createMany({ data })
  }
}
