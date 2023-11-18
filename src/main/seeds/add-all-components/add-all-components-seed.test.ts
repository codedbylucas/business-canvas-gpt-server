/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { PrismaClient } from '@prisma/client'
import type { ComponentModel } from '@/domain/models/db-models'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { addAllComponentsSeed } from './add-all-components-seed'

const makeFakeComponentModels = (): ComponentModel[] => ([
  { id: 'any_id_1', name: 'customerSegments' },
  { id: 'any_id_2', name: 'valuePropositions' }
])

let prisma: PrismaClient

describe('AddAllComponents Seed', () => {
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
    await addAllComponentsSeed()
    const components = await prisma.component.findMany()
    expect(components.length).toBe(9)
  })

  it('Should not add all Components if have already been created', async () => {
    await prisma.component.createMany({ data: makeFakeComponentModels() })
    await addAllComponentsSeed()
    const components = await prisma.component.findMany()
    expect(components.length).toBe(2)
  })
})
