/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { QuestionModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import type { Redis } from 'ioredis'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { executeSeeds } from './execute-seeds'
import RedisMock from 'ioredis-mock'

let redis: Redis
let prisma: PrismaClient

describe('executeSeeds()', () => {
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
    await prisma.component.deleteMany()
  })

  afterAll(async () => {
    redis.disconnect()
    await prisma.$disconnect()
  })

  it('Should add all Questions in DB with Prisma', async () => {
    await executeSeeds()
    const questions = await prisma.question.findMany()
    const alternatives = await prisma.alternative.findMany()
    expect(questions.length).toBe(3)
    expect(alternatives.length).toBe(2)
  })

  it('Should reply all Questions in Cache with Redis', async () => {
    await executeSeeds()
    const questionsJson = await redis.get('questions') as string
    const questions = JSON.parse(questionsJson) as QuestionModel[]
    expect(questions.length).toBe(3)
  })

  it('Should add all Components in DB', async () => {
    await executeSeeds()
    const components = await prisma.component.findMany()
    expect(components.length).toBe(9)
  })
})
