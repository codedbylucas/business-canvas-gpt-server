export class TypeOfBusiness {
  private static content: string

  private static setContent (): void {
    if (!this.content) {
      this.content = 'Qual o tipo do seu negócio?'
    }
  }

  static getContent (): string {
    this.setContent()
    return this.content
  }
}
