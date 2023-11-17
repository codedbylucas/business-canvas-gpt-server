import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { IdModel } from '@/domain/models/output-models'
import type { AddManyQuestionsRepo } from '@/interactions/contracts/db'
import type { QuestionModel } from '@/domain/models/db-models'
import type { QuestionEntityModel } from '@/domain/entities/question/question-entity-model'
import { Alternative } from '@/domain/entities/alternative/alternative'
import { AddManyQuestionsUseCase } from './add-many-questions-usecase'
import { Question } from '@/domain/entities/question/question'

jest.mock('@/domain/entities/question/question', () => ({
  Question: {
    createMany: jest.fn(() => (makeFakeQuestionsEntityModel())),
    getQuestion: jest.fn((
      question: { content: string, alternatives?: Alternative[] }
    ) => ({
      content: question.content,
      alternatives: question.alternatives
    }))
  }
}))

jest.mock('@/domain/entities/alternative/alternative', () => ({
  Alternative: {
    create: jest.fn((description: string) => ({ description })),
    getDescription: jest.fn(
      (alternative: { description: string }) => (alternative.description)
    )
  }
}))

const makeFakeQuestionsEntityModel = (): QuestionEntityModel[] => ([{
  content: 'any_content',
  alternatives: [
    Alternative.create('any_alternative'),
    Alternative.create('other_alternative')
  ]
}, {
  content: 'other_content'
}
])

const makeFakeQuestionsModel = (): QuestionModel[] => ([{
  id: 'any_id_1',
  content: 'any_content',
  alternatives: [{
    id: 'any_id_2',
    description: 'any_alternative',
    questionId: 'any_id_1'
  }, {
    id: 'any_id_3',
    description: 'other_alternative',
    questionId: 'any_id_1'
  }]
}, {
  id: 'any_id_4', content: 'other_content'
}])

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderSpy implements IdBuilder {
    private callsCount = 0
    build (): IdModel {
      this.callsCount++
      return { id: `any_id_${this.callsCount}` }
    }
  }
  return new IdBuilderSpy()
}

const makeAddManyQuestionsRepo = (): AddManyQuestionsRepo => {
  class AddManyQuestionsRepoStub implements AddManyQuestionsRepo {
    async addMany (data: QuestionModel[]): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddManyQuestionsRepoStub()
}

interface SutTypes {
  sut: AddManyQuestionsUseCase
  idBuilderSpy: IdBuilder
  addManyQuestionsRepoStub: AddManyQuestionsRepo
}

const makeSut = (): SutTypes => {
  const idBuilderSpy = makeIdBuilder()
  const addManyQuestionsRepoStub = makeAddManyQuestionsRepo()
  const sut = new AddManyQuestionsUseCase(idBuilderSpy, addManyQuestionsRepoStub)
  return { sut, idBuilderSpy, addManyQuestionsRepoStub }
}

describe('AddManyQuestions UseCase', () => {
  it('Should call Question Entity ', async () => {
    const { sut } = makeSut()
    const createManySpy = jest.spyOn(Question, 'createMany')
    await sut.perform()
    expect(createManySpy).toHaveBeenCalled()
  })

  it('Should throw if Question Entity throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(Question, 'createMany').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderSpy } = makeSut()
    const buildSpy = jest.spyOn(idBuilderSpy, 'build')
    await sut.perform()
    expect(buildSpy).toHaveBeenCalledTimes(4)
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderSpy } = makeSut()
    jest.spyOn(idBuilderSpy, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddManyQuestionsRepo with correct values', async () => {
    const { sut, addManyQuestionsRepoStub } = makeSut()
    const addSpy = jest.spyOn(addManyQuestionsRepoStub, 'addMany')
    await sut.perform()
    expect(addSpy).toHaveBeenCalledWith(makeFakeQuestionsModel())
  })

  it('Should throw if AddManyQuestionsRepo throws', async () => {
    const { sut, addManyQuestionsRepoStub } = makeSut()
    jest.spyOn(addManyQuestionsRepoStub, 'addMany').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })
})
