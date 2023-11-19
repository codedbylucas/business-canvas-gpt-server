import type { BusinessCanvasModel, ComponentModel, UserModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../helpers/prisma-helper'
import { BusinessCanvasPrismaRepo } from './business-canvas-repo'
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

const makeFakeComponentModels = (): ComponentModel[] => ([
  { id: 'any_id_1', name: 'customerSegments' },
  { id: 'any_id_2', name: 'valuePropositions' },
  { id: 'any_id_3', name: 'channels' },
  { id: 'any_id_4', name: 'customerRelationships' },
  { id: 'any_id_5', name: 'revenueStreams' },
  { id: 'any_id_6', name: 'keyResources' },
  { id: 'any_id_7', name: 'keyActivities' },
  { id: 'any_id_8', name: 'keyPartnerships' },
  { id: 'any_id_9', name: 'costStructure' }
])

const makeFakeBusinessCanvasModel = (): BusinessCanvasModel => ({
  id: 'any_business_canvas_id',
  name: 'any_business_canvas_name',
  createdAt,
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

interface FakeBusinessCanvasType {
  id: string
  name: string
  createdAt: Date
  userId: string
}

const makeFakeBusinessCanvas = (): FakeBusinessCanvasType => ({
  id: 'any_business_canvas_id',
  name: 'any_business_canvas_name',
  createdAt,
  userId: 'any_user_id'
})

interface FakeBusinessCanvasComponentType {
  businessCanvasId: string
  componentName: string
  topics: string[]
}

const makeFakeBusinessCanvasComponent = (): FakeBusinessCanvasComponentType[] => {
  const components = makeFakeBusinessCanvasModel().components
  const businessCanvasId = 'any_business_canvas_id'
  const result = Object.entries(components).map(([componentName, topics]) => ({
    businessCanvasId,
    componentName,
    topics
  }))
  return result
}

let prismock: PrismaClient

describe('BusinessCanvasPrisma Repo', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getCli').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.businessCanvas.deleteMany()
    await prismock.businessCanvasComponent.deleteMany()
    await prismock.component.deleteMany()
    await prismock.user.deleteMany()
  })

  afterAll(async () => {
    MockDate.reset()
    await prismock.$disconnect()
  })

  describe('add()', () => {
    it('Should add BusinessCanvas to an User on success', async () => {
      await prismock.user.create({ data: makeFakeUserModel() })
      await prismock.component.createMany({ data: makeFakeComponentModels() })
      const sut = new BusinessCanvasPrismaRepo()
      await sut.add(makeFakeBusinessCanvasModel())
      const businessCanvas = await prismock.businessCanvas.findUnique({
        where: { id: 'any_business_canvas_id' }
      })
      expect(businessCanvas).toEqual(makeFakeBusinessCanvas())
    })

    it('Should relate the BusinessCanvas to the User', async () => {
      await prismock.user.create({ data: makeFakeUserModel() })
      await prismock.component.createMany({ data: makeFakeComponentModels() })
      const sut = new BusinessCanvasPrismaRepo()
      await sut.add(makeFakeBusinessCanvasModel())
      const businessCanvas = await prismock.user.findUnique({
        where: { id: 'any_user_id' },
        select: { BusinessCanvas: true }
      })
      expect(businessCanvas).toEqual({ BusinessCanvas: [makeFakeBusinessCanvas()] })
    })

    it('Should relate the BusinessCanvas to the Components', async () => {
      await prismock.user.create({ data: makeFakeUserModel() })
      await prismock.component.createMany({ data: makeFakeComponentModels() })
      const sut = new BusinessCanvasPrismaRepo()
      await sut.add(makeFakeBusinessCanvasModel())
      const businessCanvas = await prismock.businessCanvas.findUnique({
        where: { id: 'any_business_canvas_id' },
        select: { BusinessCanvasComponent: true }
      })
      expect(businessCanvas).toEqual({
        BusinessCanvasComponent: makeFakeBusinessCanvasComponent()
      })
    })
  })

  describe('fetchAllByUserId()', () => {
    it('Should return all business canvas of the user', async () => {
      const sut = new BusinessCanvasPrismaRepo()
      await prismock.user.create({ data: makeFakeUserModel() })
      await prismock.component.createMany({ data: makeFakeComponentModels() })
      await prismock.businessCanvas.create({
        data: {
          id: 'any_business_canvas_id',
          name: 'any_business_canvas_name',
          createdAt,
          userId: 'any_user_id'
        }
      })
      const componentEntries = Object.entries(makeFakeBusinessCanvasModel().components)
      await prismock.businessCanvasComponent.createMany({
        data: componentEntries.map(([componentName, topics]) => ({
          businessCanvasId: 'any_business_canvas_id', componentName, topics
        }))
      })
      const businessCanvasOfTheUser = await sut.fetchAllByUserId('any_user_id')
      expect(businessCanvasOfTheUser).toEqual([{
        id: 'any_business_canvas_id',
        name: 'any_business_canvas_name',
        createdAt
      }])
    })

    it('Should return empty list if not found business canvas', async () => {
      const sut = new BusinessCanvasPrismaRepo()
      await prismock.user.create({ data: makeFakeUserModel() })
      const businessCanvasOfTheUser = await sut.fetchAllByUserId('any_user_id')
      expect(businessCanvasOfTheUser.length).toBe(0)
    })
  })

  describe('fetchOneOfTheUser()', () => {
    it('Should return an BusinessCanvasModel', async () => {
      const sut = new BusinessCanvasPrismaRepo()
      await prismock.user.create({ data: makeFakeUserModel() })
      await prismock.component.createMany({ data: makeFakeComponentModels() })
      await prismock.businessCanvas.create({
        data: {
          id: 'any_business_canvas_id',
          name: 'any_business_canvas_name',
          createdAt,
          userId: 'any_user_id'
        }
      })
      const componentEntries = Object.entries(makeFakeBusinessCanvasModel().components)
      await prismock.businessCanvasComponent.createMany({
        data: componentEntries.map(([componentName, topics]) => ({
          businessCanvasId: 'any_business_canvas_id', componentName, topics
        }))
      })
      const businessCanvasOfTheUser = await sut.fetchOneOfTheUser({
        userId: 'any_user_id',
        businessCanvasId: 'any_business_canvas_id'
      })
      expect(businessCanvasOfTheUser).toEqual(makeFakeBusinessCanvasModel())
    })

    it('Should return null if userId is invalid', async () => {
      const sut = new BusinessCanvasPrismaRepo()
      await prismock.user.create({ data: makeFakeUserModel() })
      await prismock.component.createMany({ data: makeFakeComponentModels() })
      await prismock.businessCanvas.create({
        data: {
          id: 'any_business_canvas_id',
          name: 'any_business_canvas_name',
          createdAt,
          userId: 'any_user_id'
        }
      })
      const componentEntries = Object.entries(makeFakeBusinessCanvasModel().components)
      await prismock.businessCanvasComponent.createMany({
        data: componentEntries.map(([componentName, topics]) => ({
          businessCanvasId: 'any_business_canvas_id', componentName, topics
        }))
      })
      const businessCanvasOfTheUser = await sut.fetchOneOfTheUser({
        userId: 'invalid_user_id',
        businessCanvasId: 'any_business_canvas_id'
      })
      expect(businessCanvasOfTheUser).toBe(null)
    })
  })
})
