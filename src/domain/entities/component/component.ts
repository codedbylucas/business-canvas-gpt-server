export type ComponentName =
  | 'customerSegments'
  | 'valuePropositions'
  | 'channels'
  | 'customerRelationships'
  | 'revenueStreams'
  | 'keyResources'
  | 'keyActivities'
  | 'keyPartnerships'
  | 'costStructure'

export class Component {
  private static readonly names: ComponentName[] = []

  private constructor (private readonly name: ComponentName) {
    Object.freeze(this)
    Component.names.push(this.name)
  }

  static getComponent (data: Component): undefined | ComponentName {
    if (!data) return undefined
    return Component.names.find(name => name === data.name)
  }

  private static create (name: ComponentName): Component {
    return new Component(name)
  }

  static createMany (): Component[] {
    const componentNames: ComponentName[] = [
      'customerSegments',
      'valuePropositions',
      'channels',
      'customerRelationships',
      'revenueStreams',
      'keyResources',
      'keyActivities',
      'keyPartnerships',
      'costStructure'
    ]
    const components: Component[] = []
    for (const name of componentNames) {
      components.push(this.create(name))
    }
    return components
  }
}
