import type { Redis } from 'ioredis'
import type { QuestionModel } from '@/domain/models/db-models'
import { QuestionRedisCache } from './question-redis-cache'
import { RedisHelper } from './helpers/redis-helper'
import RedisMock from 'ioredis-mock'

const makeFakeQuestions = (): QuestionModel[] => ([
  {
    id: 'any_question_id',
    content: 'any_content',
    alternatives: [{
      id: 'any_alternative_id',
      description: 'any_alternative',
      questionId: 'any_question_id'
    }, {
      id: 'other_alternative_id',
      description: 'other_alternative',
      questionId: 'any_question_id'
    }]
  },
  { id: 'other_question_id', content: 'other_content' }
])

const makeSut = (): QuestionRedisCache => {
  return new QuestionRedisCache()
}

let redis: Redis

describe('StockSymbolsRedis Cache', () => {
  beforeAll(() => {
    redis = new RedisMock()
    jest.spyOn(RedisHelper, 'getInstance').mockReturnValue(redis)
  })

  afterAll(() => {
    redis.disconnect()
  })

  beforeEach(async () => {
    await redis.flushall()
  })

  describe('fetchAll()', () => {
    it('Should fetch all questions on success', async () => {
      const sut = makeSut()
      await redis.set('questions', JSON.stringify(makeFakeQuestions()))
      const questions = await sut.fetchAll()
      expect(questions).toEqual(makeFakeQuestions())
    })

    it('Should return empty list if questions not exist', async () => {
      const sut = makeSut()
      const questions = await sut.fetchAll()
      expect(questions.length).toBe(0)
    })

    it('Should return empty list if questions is empty list', async () => {
      const sut = makeSut()
      await redis.set('questions', JSON.stringify([]))
      const questions = await sut.fetchAll()
      expect(questions.length).toBe(0)
    })
  })

  describe('addMany()', () => {
    it('Should add many questions with alternatives on success', async () => {
      const sut = makeSut()
      await sut.addMany(makeFakeQuestions())
      const questionsJson = await redis.get('questions') as string
      const questions = JSON.parse(questionsJson)
      expect(questions).toEqual(makeFakeQuestions())
    })
  })
})
