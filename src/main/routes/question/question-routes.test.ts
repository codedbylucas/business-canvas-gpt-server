/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { QuestionModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import type { Redis } from 'ioredis'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import RedisMock from 'ioredis-mock'
import app from '@/main/configs/app'
import request from 'supertest'

const makeFakeQuestions = (): QuestionModel[] => ([
  { id: 'any_id', content: 'any_content', type: 'text' },
  { id: 'other_id', content: 'other_content', type: 'text' }
])

let redis: Redis
let prisma: PrismaClient

describe('Question Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getCli()
    redis = new RedisMock()
    jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
    await redis.flushall()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
    redis.disconnect()
  })

  describe('GET /question', () => {
    it('Should return 200 on fetch all questions', async () => {
      await redis.set('questions', JSON.stringify(makeFakeQuestions()))
      await request(app)
        .get('/api/question')
        .expect(200)
    })
  })
})
