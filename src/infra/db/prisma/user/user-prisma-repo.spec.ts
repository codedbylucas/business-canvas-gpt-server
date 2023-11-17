import type { UserModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import { UserPrismaRepo } from './user-prisma-repo'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../helpers/prisma-helper'
import MockDate from 'mockdate'

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
})

let prismock: PrismaClient

describe('UserPrisma Repo', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getCli').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  beforeEach(async () => {
    await prismock.user.deleteMany()
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe('add()', () => {
    it('Should create new User if create() is a success', async () => {
      const sut = new UserPrismaRepo()
      await sut.add(makeFakeUserModel())
      const user = await prismock.user.findUnique({ where: { id: 'any_id' } })
      expect(user).toEqual(makeFakeUserModel())
    })
  })

  describe('fetchByEmail()', () => {
    it('Should return an User if findUnique() is a success', async () => {
      const sut = new UserPrismaRepo()
      await prismock.user.create({ data: makeFakeUserModel() })
      const user = await sut.fetchByEmail('any_email@mail.com')
      expect(user).toEqual(makeFakeUserModel())
    })

    it('Should return null if findUnique() not found User', async () => {
      const sut = new UserPrismaRepo()
      const user = await sut.fetchByEmail('any_email@mail.com')
      expect(user).toBeNull()
    })
  })

  describe('fetchById()', () => {
    it('Should return an User if findUnique() is a success', async () => {
      const sut = new UserPrismaRepo()
      await prismock.user.create({ data: makeFakeUserModel() })
      const user = await sut.fetchById('any_id')
      expect(user).toEqual(makeFakeUserModel())
    })

    it('Should return null if findUnique() not found User', async () => {
      const sut = new UserPrismaRepo()
      const user = await sut.fetchById('any_id')
      expect(user).toBeNull()
    })
  })
})
