import { PrismaClient } from '@prisma/client'

export class PrismaHelper {
  private static client: null | PrismaClient

  static async connect (): Promise<void> {
    if (!this.client) {
      this.client = new PrismaClient()
      await this.client.$connect()
    }
    console.log('Prisma connected!')
  }

  static async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.$disconnect()
      this.client = null
    }
    console.log('Prisma disconected!')
  }

  static async getCli (): Promise<PrismaClient> {
    if (!this.client) {
      await this.connect()
    }
    return this.client as PrismaClient
  }
}
