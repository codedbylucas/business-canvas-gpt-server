/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { AlternativeModel, QuestionModel } from '@/domain/models/db-models'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import type { PrismaClient, Question } from '@prisma/client'
import type { Redis } from 'ioredis'
import RedisMock from 'ioredis-mock'
import { addAndReplyQuestionsSeed } from './add-and-reply-questions-seed'

const makeFakeQuestions = (): Question[] => ([{
  id: 'any_question_id',
  content: 'any_content',
  type: 'text'
}])

const makeFakeAlternatives = (): AlternativeModel[] => ([{
  id: 'any_alternative_id',
  description: 'any_description',
  questionId: 'any_question_id'
}])

let redis: Redis
let prisma: PrismaClient

describe('AddAndReplyQuestions Seed', () => {
  beforeAll(async () => {
    redis = new RedisMock()
    jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getCli()
  })

  beforeEach(async () => {
    await redis.flushall()
    await prisma.question.deleteMany()
    await prisma.alternative.deleteMany()
  })

  afterAll(async () => {
    redis.disconnect()
    await prisma.$disconnect()
  })

  it('Should add all Questions in DB with Prisma', async () => {
    await addAndReplyQuestionsSeed()
    const questions = await prisma.question.findMany()
    const alternatives = await prisma.alternative.findMany()
    expect(questions.length).toBe(3)
    expect(alternatives.length).toBe(2)
  })

  it('Should reply all Questions in Cache with Redis', async () => {
    await addAndReplyQuestionsSeed()
    const questionsJson = await redis.get('questions') as string
    const questions = JSON.parse(questionsJson) as QuestionModel[]
    expect(questions.length).toBe(3)
  })

  it('Should not add all Questions if have already been created', async () => {
    await prisma.question.createMany({ data: makeFakeQuestions() })
    await prisma.alternative.createMany({ data: makeFakeAlternatives() })
    await addAndReplyQuestionsSeed()
    const questions = await prisma.question.findMany()
    const alternatives = await prisma.alternative.findMany()
    expect(questions.length).toBe(1)
    expect(alternatives.length).toBe(1)
  })

  it('Should not reply all Questions in Cache if have already been replicated', async () => {
    await prisma.question.createMany({ data: makeFakeQuestions() })
    await redis.set('questions', JSON.stringify(makeFakeQuestions()))
    await addAndReplyQuestionsSeed()
    const questionsJson = await redis.get('questions') as string
    const questions = JSON.parse(questionsJson) as QuestionModel[]
    expect(questions.length).toBe(1)
  })
})
