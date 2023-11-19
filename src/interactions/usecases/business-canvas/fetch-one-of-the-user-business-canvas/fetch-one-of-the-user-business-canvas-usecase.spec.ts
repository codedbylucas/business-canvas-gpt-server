import type { FetchOneOfTheUserBusinessCanvasDto } from '@/domain/contracts'
import type { BusinessCanvasModel } from '@/domain/models/db-models'
import type { FetchOneOfTheUserBusinessCanvasRepo } from '@/interactions/contracts/db'
import { BusinessCanvasNotFoundError } from '@/domain/errors'
import { FetchOneOfTheUserBusinessCanvasUseCase } from './fetch-one-of-the-user-business-canvas-usecase'
import { FormatDate } from '@/domain/processes/format-date/format-date'
import MockDate from 'mockdate'

jest.mock('@/domain/processes/format-date/format-date', () => ({
  FormatDate: {
    execute: jest.fn(() => (`${10}/${12}/${2023}`))
  }
}))

const makeFakeFetchOneOfTheUserBusinessCanvasDto = (): FetchOneOfTheUserBusinessCanvasDto => ({
  userId: 'any_user_id',
  businessCanvasId: 'any_business_canvas_id'
})

const makeFakeBusinessCanvasModel = (): BusinessCanvasModel => ({
  id: 'any_id',
  name: 'any_business_canvas_name',
  createdAt: new Date(),
  userId: 'any_user_id',
  components: {
    customerSegments: ['any_customer_segments'],
    valuePropositions: ['any_value_propositions'],
    channels: ['any_channels'],
    customerRelationships: ['any_customer_relationships'],
    revenueStreams: ['any_revenue_streams'],
    keyResources: ['any_key_resources'],
    keyActivities: ['any_key_activities'],
    keyPartnerships: ['any_key_partnerships'],
    costStructure: ['any_cost_structure']
  }
})

const makeFetchOneOfTheUserBusinessCanvasRepo = (): FetchOneOfTheUserBusinessCanvasRepo => {
  class FetchOneOfTheUserBusinessCanvasRepoStub implements FetchOneOfTheUserBusinessCanvasRepo {
    async fetchOneOfTheUser (dto: FetchOneOfTheUserBusinessCanvasDto): Promise<null | BusinessCanvasModel> {
      return await Promise.resolve(makeFakeBusinessCanvasModel())
    }
  }
  return new FetchOneOfTheUserBusinessCanvasRepoStub()
}

interface SutTypes {
  sut: FetchOneOfTheUserBusinessCanvasUseCase
  fetchOneOfTheUserBusinessCanvasRepoStub: FetchOneOfTheUserBusinessCanvasRepo
}

const makeSut = (): SutTypes => {
  const fetchOneOfTheUserBusinessCanvasRepoStub = makeFetchOneOfTheUserBusinessCanvasRepo()
  const sut = new FetchOneOfTheUserBusinessCanvasUseCase(fetchOneOfTheUserBusinessCanvasRepoStub)
  return { sut, fetchOneOfTheUserBusinessCanvasRepoStub }
}

describe('FetchOneOfTheUserBusinessCanvas UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date('2023-12-10T00:00:00'))
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call FetchOneOfTheUserBusinessCanvasRepo with correct user id', async () => {
    const { sut, fetchOneOfTheUserBusinessCanvasRepoStub } = makeSut()
    const fetchAllByUserIdSpy = jest.spyOn(fetchOneOfTheUserBusinessCanvasRepoStub, 'fetchOneOfTheUser')
    await sut.perform(makeFakeFetchOneOfTheUserBusinessCanvasDto())
    expect(fetchAllByUserIdSpy).toHaveBeenCalledWith(makeFakeFetchOneOfTheUserBusinessCanvasDto())
  })

  it('Should return NotAllBusinessCanvasError if FetchOneOfTheUserBusinessCanvasRepo returns empty list', async () => {
    const { sut, fetchOneOfTheUserBusinessCanvasRepoStub } = makeSut()
    jest.spyOn(fetchOneOfTheUserBusinessCanvasRepoStub, 'fetchOneOfTheUser').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeFetchOneOfTheUserBusinessCanvasDto())
    expect(result.value).toEqual(new BusinessCanvasNotFoundError('any_business_canvas_id'))
  })

  it('Should throw if FetchOneOfTheUserBusinessCanvasRepo throws', async () => {
    const { sut, fetchOneOfTheUserBusinessCanvasRepoStub } = makeSut()
    jest.spyOn(fetchOneOfTheUserBusinessCanvasRepoStub, 'fetchOneOfTheUser').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeFetchOneOfTheUserBusinessCanvasDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call FormatDate with correct dates', async () => {
    const { sut } = makeSut()
    const executeSpy = jest.spyOn(FormatDate, 'execute')
    await sut.perform(makeFakeFetchOneOfTheUserBusinessCanvasDto())
    expect(executeSpy).toHaveBeenCalledWith(new Date())
  })

  it('Should return BusinessCanvasOfTheUser on success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeFetchOneOfTheUserBusinessCanvasDto())
    const { createdAt, userId, ...remainingData } = makeFakeBusinessCanvasModel()
    const businessCanvasOfTheUser = { createdAt: '10/12/2023', ...remainingData }
    expect(result.value).toEqual(businessCanvasOfTheUser)
  })
})
