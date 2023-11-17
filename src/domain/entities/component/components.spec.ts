import { Component as sut } from './component'

describe('Component Entity', () => {
  it('Should create many Components', async () => {
    const components = sut.createMany()
    expect(components).toEqual([
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
  })

  it('Should return a Component Name if getComponent is a success', async () => {
    const components = sut.createMany()
    const componentName = sut.getComponent(components[0])
    const componentName2 = sut.getComponent(components[1])
    expect(componentName).toBe('customerSegments')
    expect(componentName2).toBe('valuePropositions')
  })

  it('Should return undefined if getComponent not found a Component', async () => {
    const components = sut.createMany()
    const result = sut.getComponent(components[20])
    expect(result).toBeUndefined()
  })
})
