export class BusinessCanvasNotFoundError extends Error {
  constructor (businessCanvasId: string) {
    super(`Business Canvas with ID: '${businessCanvasId}' not found`)
    this.name = 'BusinessCanvasNotFoundError'
  }
}
