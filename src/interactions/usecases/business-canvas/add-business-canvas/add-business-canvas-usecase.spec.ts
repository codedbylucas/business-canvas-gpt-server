import type { IdModel } from '@/domain/models/output-models'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { AddBusinessCanvasDto } from '@/domain/contracts'
import type { AddBusinessCanvasRepo } from '@/interactions/contracts/db'
import type { BusinessCanvasModel } from '@/domain/models/db-models'
import { AddBusinessCanvasUseCase } from './add-business-canvas-usecase'
import MockDate from 'mockdate'

const makeFakeAddBusinessCanvasDto = (): AddBusinessCanvasDto => ({
  userId: 'any_user_id',
  name: 'any_business_canvas_name',
  customerSegments: ['any_customer_segments'],
  valuePropositions: ['any_value_propositions'],
  channels: ['any_channels'],
  customerRelationships: ['any_customer_relationships'],
  revenueStreams: ['any_revenue_streams'],
  keyResources: ['any_key_resources'],
  keyActivities: ['any_key_activities'],
  keyPartnerships: ['any_key_partnerships'],
  costStructure: ['any_cost_structure']
})

const makeFakeBusinessCanvasModel = (): BusinessCanvasModel => {
  const { userId, name, ...components } = makeFakeAddBusinessCanvasDto()
  return {
    id: 'any_id',
    createdAt: new Date(),
    name,
    userId,
    components
  }
}

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): IdModel {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

const makeAddBusinessCanvasRepo = (): AddBusinessCanvasRepo => {
  class AddBusinessCanvasRepoStub implements AddBusinessCanvasRepo {
    async add (dto: BusinessCanvasModel): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddBusinessCanvasRepoStub()
}

interface SutTypes {
  sut: AddBusinessCanvasUseCase
  idBuilderStub: IdBuilder
  addBusinessCanvasRepoStub: AddBusinessCanvasRepo
}

const makeSut = (): SutTypes => {
  const idBuilderStub = makeIdBuilder()
  const addBusinessCanvasRepoStub = makeAddBusinessCanvasRepo()
  const sut = new AddBusinessCanvasUseCase(idBuilderStub, addBusinessCanvasRepoStub)
  return { sut, idBuilderStub, addBusinessCanvasRepoStub }
}

describe('AddBusinessCanvas UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeAddBusinessCanvasDto())
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeAddBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddBusinessCanvasRepo with correct values', async () => {
    const { sut, addBusinessCanvasRepoStub } = makeSut()
    const addSpy = jest.spyOn(addBusinessCanvasRepoStub, 'add')
    await sut.perform(makeFakeAddBusinessCanvasDto())
    expect(addSpy).toHaveBeenCalledWith(makeFakeBusinessCanvasModel())
  })
})
