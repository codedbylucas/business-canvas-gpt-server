import type { PrismaClient } from '@prisma/client'
import type { ComponentModel } from '@/domain/models/db-models'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../helpers/prisma-helper'
import { ComponentPrismaRepo } from './component-prisma-repo'

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

let prismock: PrismaClient

describe('ComponentPrisma Repo', () => {
  beforeAll(async () => {
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getCli').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.component.deleteMany()
  })

  afterAll(async () => {
    await prismock.$disconnect()
  })

  it('Should create all Components on success', async () => {
    const sut = new ComponentPrismaRepo()
    await sut.addAll(makeFakeComponentModels())
    const components = await prismock.component.findMany()
    expect(components).toEqual(makeFakeComponentModels())
  })
})
