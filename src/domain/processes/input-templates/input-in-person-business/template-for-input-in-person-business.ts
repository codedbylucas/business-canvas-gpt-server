import type { TemplateInputModel } from '@/domain/models/output-models'

export class TemplateForInputInPersonBusiness {
  static create (): TemplateInputModel {
    const input = this.createInputModel()
    return { input }
  }

  private static createInputModel (): string {
    return `Crie um Business Canvas detalhado para o meu empreendimento. O empreendimento é de tipo físico (presencial). Local da operação ou público-alvo é {{location}}. A descrição do negócio é a seguinte: {{description}}.
Certifique-se de abordar os nove componentes do Business Canvas com ênfase nas particularidades do tipo de negócio. Seja criativo e detalhado criando tópicos específicos para cada componente do Business Canvas. Você pode adicionar até 3 tópicos para cada componente.
Crie também um nome para o Business Canvas utilizando como base o tipo do negócio, sua localização e sua descrição.
Retorne um objeto JSON com informações detalhadas para cada um desses componentes. Separe os objetos desta forma:
As chaves do JSON devem ser:
“name”, “customerSegments”, “valuePropositions“, “channels“, “customerRelationships“, “revenueStreams“, “keyResources“, “keyActivities“, “keyPartnerships“, “costStructure“
{
“name”: “Nome baseado no tipo do negócio, sua localização e na sua descrição”, 
  "valueProposition": [
    "descrição detalhada da proposta de valor"
    ...
  ],
  ...
}
Todas as informações devem estar no infinitivo, não conjugar verbos na primeira pessoa.
Não inclua nenhum texto adicional além do Business Canvas em JSON. Nada além do JSON.
`
  }
}
