import type { CreateBusinessCanvas, CreateBusinessCanvasDto, CreateBusinessCanvasRes } from '@/domain/contracts'
import type { Validation } from '@/presentation/contracts/validation'
import type { HttpRequest } from '@/presentation/http/http'
import type { BusinessCanvasApiModel } from '@/domain/models/output-models'
import { right, type Either, left } from '@/shared/either'
import { CreateBusinessCanvasController } from './create-business-canvas-controller'
import { badRequest, created, serverError } from '@/presentation/helpers/http/http-helpers'
import { ServerError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    userId: 'any_user_id'
  },
  body: [{
    questionId: 'any_question_id',
    answer: 'any_answer'
  }, {
    questionId: 'other_question_id',
    answer: 'other_answer'
  }, {
    questionId: 'another_question_id',
    alternativeId: 'any_alternative_id'
  }]
})

const makeFakeBusinessCanvasApiModel = (): BusinessCanvasApiModel => ({
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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

const makeCreateBusinessCanvas = (): CreateBusinessCanvas => {
  class CreateBusinessCanvasStub implements CreateBusinessCanvas {
    async perform (dto: CreateBusinessCanvasDto): Promise<CreateBusinessCanvasRes> {
      return await Promise.resolve(right({
        id: 'any_business_canvas_id',
        ...makeFakeBusinessCanvasApiModel()
      }))
    }
  }
  return new CreateBusinessCanvasStub()
}

interface SutTypes {
  sut: CreateBusinessCanvasController
  validationStub: Validation
  createBusinessCanvasStub: CreateBusinessCanvas
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const createBusinessCanvasStub = makeCreateBusinessCanvas()
  const sut = new CreateBusinessCanvasController(validationStub, createBusinessCanvasStub)
  return { sut, validationStub, createBusinessCanvasStub }
}

describe('CreateBusinessCanvas Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    error.stack = 'any_stack'
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should call CreateBusinessCanvas with correct values', async () => {
    const { sut, createBusinessCanvasStub } = makeSut()
    const performSpy = jest.spyOn(createBusinessCanvasStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith({
      userId: 'any_user_id', answers: makeFakeRequest().body
    })
  })

  it('Should call CreateBusinessCanvas without user id if not provided in headers', async () => {
    const { sut, createBusinessCanvasStub } = makeSut()
    const performSpy = jest.spyOn(createBusinessCanvasStub, 'perform')
    await sut.handle({ headers: {}, body: makeFakeRequest().body })
    expect(performSpy).toHaveBeenCalledWith({ answers: makeFakeRequest().body })
  })

  it('Should return 400 if CreateBusinessCanvas returns an error', async () => {
    const { sut, createBusinessCanvasStub } = makeSut()
    jest.spyOn(createBusinessCanvasStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if CreateBusinessCanvas throws', async () => {
    const { sut, createBusinessCanvasStub } = makeSut()
    jest.spyOn(createBusinessCanvasStub, 'perform').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    const error = new Error()
    expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
  })

  it('Should return 201 if CreateBusinessCanvas is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(created({
      id: 'any_business_canvas_id',
      ...makeFakeBusinessCanvasApiModel()
    }))
  })
})
