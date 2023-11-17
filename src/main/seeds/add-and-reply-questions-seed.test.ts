/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { PrismaClient } from '@prisma/client'
import type { Redis } from 'ioredis'
import type { QuestionModel } from '@/domain/models/db-models'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import RedisMock from 'ioredis-mock'
import addAndReplyQuestionsSeed from './add-and-reply-questions-seed'

let redis: Redis
let prisma: PrismaClient

describe('AddAndReplyQuestions Seed', () => {
  beforeAll(async () => {
    redis = new RedisMock()
    jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getCli()
  })

  afterEach(async () => {
    await prisma.question.deleteMany()
    await prisma.alternative.deleteMany()
  })

  afterAll(async () => {
    redis.disconnect()
    await prisma.$disconnect()
  })

  it('Should add all Questions in DB with Prisma', async () => {
    await addAndReplyQuestionsSeed
    const questions = await prisma.question.findMany()
    const alternatives = await prisma.alternative.findMany()
    expect(questions.length).toBe(3)
    expect(alternatives.length).toBe(2)
  })

  it('Should reply all Questions in Cache with Redis', async () => {
    await addAndReplyQuestionsSeed
    const questionsJson = await redis.get('questions') as string
    const questions = JSON.parse(questionsJson) as QuestionModel[]
    expect(questions.length).toBe(3)
  })
})
