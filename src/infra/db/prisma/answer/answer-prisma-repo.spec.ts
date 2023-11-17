import type { AddManyAnswersRepoDto } from '@/interactions/contracts/db'
import type { Prisma, PrismaClient } from '@prisma/client'
import type { AlternativeModel, QuestionModel, UserModel } from '@/domain/models/db-models'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../helpers/prisma-helper'
import { AnswerPrismaRepo } from './answer-prisma-repo'
import MockDate from 'mockdate'

const createdAt = new Date()

const makeFakeUserModel = (): UserModel => ({
  id: 'any_user_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: 'user',
  createdAt,
  updatedAt: new Date()
})

const makeFakeAlternativeModels = (): AlternativeModel[] => ([{
  id: 'any_alternative_id',
  description: 'any_alternative_description',
  questionId: 'any_question_id'
}, {
  id: 'other_alternative_id',
  description: 'other_alternative_description',
  questionId: 'any_question_id'
}])

const makeFakeQuestionModels = (): QuestionModel[] => ([{
  id: 'any_question_id',
  content: 'any_question_content',
  alternatives: makeFakeAlternativeModels()
}, {
  id: 'other_question_id', content: 'other_question_content'
}])

const makeFakeAddManyAnswersRepoDto = (): AddManyAnswersRepoDto => ({
  userId: 'any_user_id',
  answers: [{
    id: 'any_answer_id',
    createdAt,
    alternativeId: 'any_alternative_id',
    questionId: 'any_question_id'
  }, {
    id: 'other_answer_id',
    createdAt,
    description: 'any_answer_description',
    questionId: 'other_question_id'
  }]
})

const makeFakeAnswerCreateManyInput = (): Prisma.AnswerCreateManyInput[] => [{
  id: 'any_answer_id',
  userId: 'any_user_id',
  createdAt,
  description: null,
  alternativeId: 'any_alternative_id',
  questionId: 'any_question_id'
}, {
  id: 'other_answer_id',
  userId: 'any_user_id',
  createdAt,
  alternativeId: null,
  description: 'any_answer_description',
  questionId: 'other_question_id'
}]

let prismock: PrismaClient

describe('AnswerPrisma Repo', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getCli').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.answer.deleteMany()
    await prismock.alternative.deleteMany()
    await prismock.question.deleteMany()
    await prismock.user.deleteMany()
  })

  afterAll(async () => {
    MockDate.reset()
    await prismock.$disconnect()
  })

  it('Should create many Answers to an User on success', async () => {
    await prismock.user.create({ data: makeFakeUserModel() })
    const data: QuestionModel[] = makeFakeQuestionModels().map(
      ({ id, content }) => ({ id, content })
    )
    await prismock.question.createMany({ data })
    await prismock.alternative.createMany({ data: makeFakeAlternativeModels() })
    const sut = new AnswerPrismaRepo()
    await sut.add(makeFakeAddManyAnswersRepoDto())
    const answers = await prismock.answer.findMany()
    expect(answers).toEqual(makeFakeAnswerCreateManyInput())
  })

  it('Should relate the answers to the user', async () => {
    await prismock.user.create({ data: makeFakeUserModel() })
    const data: QuestionModel[] = makeFakeQuestionModels().map(
      ({ id, content }) => ({ id, content })
    )
    await prismock.question.createMany({ data })
    await prismock.alternative.createMany({ data: makeFakeAlternativeModels() })
    const sut = new AnswerPrismaRepo()
    await sut.add(makeFakeAddManyAnswersRepoDto())
    const userAnswers = await prismock.user.findUnique({
      where: { id: 'any_user_id' },
      select: { Answer: true }
    })
    expect(userAnswers).toEqual({ Answer: makeFakeAnswerCreateManyInput() })
  })
})
