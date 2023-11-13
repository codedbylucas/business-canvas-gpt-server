import type { PrismaClient } from '@prisma/client'
import type { AlternativeModel, QuestionModel } from '@/domain/models/db-models'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../helpers/prisma-helper'
import { QuestionPrismaRepo } from './question-prisma-repo'

const makeFakeQuestionsModel = (): QuestionModel[] => ([
  {
    id: 'any_id',
    content: 'any_content',
    alternatives: makeFakeAlternativesModel()
  }, {
    id: 'other_id', content: 'other_content'
  }
])

const makeFakeAlternativesModel = (): AlternativeModel[] => ([
  {
    id: 'any_alternative_id',
    description: 'any_description',
    questionId: 'any_id'
  }, {
    id: 'other_alternative_id',
    description: 'other_description',
    questionId: 'any_id'
  }
])

let prismock: PrismaClient

describe('QuestionPrisma Repo', () => {
  beforeAll(async () => {
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getCli').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.question.deleteMany()
    await prismock.alternative.deleteMany()
  })

  afterAll(async () => {
    await prismock.$disconnect()
  })

  it('Should create many Questions with Alternatives on success', async () => {
    const sut = new QuestionPrismaRepo()
    await sut.addMany(makeFakeQuestionsModel())
    const questions = await prismock.question.findMany()
    const alternatives = await prismock.alternative.findMany()
    expect(questions).toEqual([
      { id: 'any_id', content: 'any_content' },
      { id: 'other_id', content: 'other_content' }
    ])
    expect(alternatives).toEqual(makeFakeAlternativesModel())
  })
})
