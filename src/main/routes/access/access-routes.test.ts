/**
 * @jest-environment ./src/main/configs/prisma-jest/prisma-environment-jest.ts
 */

import type { UserModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { hash } from 'bcrypt'
import request from 'supertest'
import app from '@/main/configs/app'

const makeFakeUserModel = (password: string): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password,
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
})

let prisma: PrismaClient

describe('Access Routes', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
    prisma = await PrismaHelper.getCli()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  describe('POST /signup', () => {
    it('Should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any name',
          email: 'any_email@mail.com',
          password: 'abcd1234',
          passwordConfirmation: 'abcd1234'
        })
        .expect(201)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const salt = 12
      const hashedPassword = await hash('any_password', salt)
      await prisma.user.create({ data: makeFakeUserModel(hashedPassword) })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
    })
  })
})
