/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { BusinessCanvasModel, ComponentModel, UserModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { hash } from 'bcrypt'
import app from '@/main/configs/app'
import env from '@/main/configs/env'
import jwt from 'jsonwebtoken'
import request from 'supertest'

const makeFakeUserModel = (password: string): UserModel => ({
  id: 'any_user_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password,
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFakeAccessToken = (): string => {
  return jwt.sign({ value: 'any_user_id' }, env.jwtSecretKey)
}

const createdAt = new Date()

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
  id: 'any_id',
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

let prisma: PrismaClient

describe('Question Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getCli()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.component.deleteMany()
    await prisma.businessCanvas.deleteMany()
    await prisma.businessCanvasComponent.deleteMany()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  describe('GET /business-canvas', () => {
    it('Should return 200 on fetch all business canvas of the user', async () => {
      const salt = 12
      const hashedPassword = await hash('any_password', salt)
      await prisma.user.create({ data: makeFakeUserModel(hashedPassword) })
      await prisma.component.createMany({ data: makeFakeComponentModels() })
      await prisma.businessCanvas.create({
        data: {
          id: 'any_business_canvas_id',
          name: 'any_business_canvas_name',
          userId: 'any_user_id',
          createdAt: new Date()
        }
      })
      const componentEntries = Object.entries(makeFakeBusinessCanvasModel().components)
      await prisma.businessCanvasComponent.createMany({
        data: componentEntries.map(([componentName, topics]) => ({
          businessCanvasId: 'any_business_canvas_id', componentName, topics
        }))
      })
      await request(app)
        .get('/api/business-canvas')
        .set('x-access-token', makeFakeAccessToken())
        .expect(200)
    })
  })
})
