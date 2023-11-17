import type { AddBusinessCanvas, AddBusinessCanvasDto } from '@/domain/contracts'
import type { AddBusinessCanvasRepo } from '@/interactions/contracts/db'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'

export class AddBusinessCanvasUseCase implements AddBusinessCanvas {
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly addBusinessCanvasRepo: AddBusinessCanvasRepo
  ) {}

  async perform (dto: AddBusinessCanvasDto): Promise<void> {
    const { name, userId, ...components } = dto
    const { id } = this.idBuilder.build()
    await this.addBusinessCanvasRepo.add({
      id, name, userId, createdAt: new Date(), components
    })
  }
}
