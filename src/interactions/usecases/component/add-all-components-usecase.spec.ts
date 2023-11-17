import type { ComponentModel } from '@/domain/models/db-models'
import type { AddAllComponentsRepo } from '@/interactions/contracts/db'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { IdModel } from '@/domain/models/output-models'
import { Component, type ComponentName } from '@/domain/entities/component'
import { AddAllComponentsUseCase } from './add-all-componetns-usecase'

jest.mock('@/domain/entities/question/question', () => ({
  Component: {
    createMany: jest.fn(() => (makeFakeComponentName())),
    getComponent: jest.fn(
      (component: { name: ComponentName }) => (component.name)
    )
  }
}))

const makeFakeComponentName = (): any => ([
  { name: 'customerSegments' },
  { name: 'valuePropositions' },
  { name: 'channels' },
  { name: 'customerRelationships' },
  { name: 'revenueStreams' },
  { name: 'keyResources' },
  { name: 'keyActivities' },
  { name: 'keyPartnerships' },
  { name: 'costStructure' }
])

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

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderSpy implements IdBuilder {
    private callsCount = 0
    build (): IdModel {
      this.callsCount++
      return { id: `any_id_${this.callsCount}` }
    }
  }
  return new IdBuilderSpy()
}

const makeAddAllComponentsRepo = (): AddAllComponentsRepo => {
  class AddAllComponentsRepoStub implements AddAllComponentsRepo {
    async addAll (data: ComponentModel[]): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddAllComponentsRepoStub()
}

interface SutTypes {
  sut: AddAllComponentsUseCase
  idBuilderSpy: IdBuilder
  addAllComponentsRepoStub: AddAllComponentsRepo
}

const makeSut = (): SutTypes => {
  const idBuilderSpy = makeIdBuilder()
  const addAllComponentsRepoStub = makeAddAllComponentsRepo()
  const sut = new AddAllComponentsUseCase(idBuilderSpy, addAllComponentsRepoStub)
  return { sut, idBuilderSpy, addAllComponentsRepoStub }
}

describe('AddAllComponents UseCase', () => {
  it('Should call Component Entity ', async () => {
    const { sut } = makeSut()
    const createManySpy = jest.spyOn(Component, 'createMany')
    await sut.perform()
    expect(createManySpy).toHaveBeenCalled()
  })

  it('Should call IdBuilder nine times', async () => {
    const { sut, idBuilderSpy } = makeSut()
    const buildSpy = jest.spyOn(idBuilderSpy, 'build')
    await sut.perform()
    expect(buildSpy).toHaveBeenCalledTimes(9)
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderSpy } = makeSut()
    jest.spyOn(idBuilderSpy, 'build').mockImplementationOnce(() => {
      throw new Error('any_message')
    })
    const promise = sut.perform()
    await expect(promise).rejects.toThrow(Error('any_message'))
  })

  it('Should call AddAllComponentsRepo with correct values', async () => {
    const { sut, addAllComponentsRepoStub } = makeSut()
    const addAllSpy = jest.spyOn(addAllComponentsRepoStub, 'addAll')
    await sut.perform()
    expect(addAllSpy).toHaveBeenCalledWith(makeFakeComponentModels())
  })

  it('Should throw if AddAllComponentsRepo throws', async () => {
    const { sut, addAllComponentsRepoStub } = makeSut()
    jest.spyOn(addAllComponentsRepoStub, 'addAll').mockReturnValueOnce(
      Promise.reject(new Error('any_message'))
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow(Error('any_message'))
  })
})
