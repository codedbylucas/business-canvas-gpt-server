/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { PrismaClient } from '@prisma/client'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import addAllComponentsSeed from './add-all-components-seed'

let prisma: PrismaClient

describe('AddAndReplyQuestions Seed', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getCli()
  })

  afterEach(async () => {
    await prisma.component.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('Should add all Components in DB', async () => {
    await addAllComponentsSeed
    const components = await prisma.component.findMany()
    expect(components.length).toBe(9)
  })
})
