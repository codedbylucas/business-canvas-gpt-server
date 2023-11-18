import 'module-alias/register'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { addAllComponentsUseCaseFactory } from '../factories/usecases/component/add-all-components'

export const addAllComponentsSeed = async (): Promise<void> => {
  const prisma = await PrismaHelper.getCli()
  const components = await prisma.component.findMany()
  if (!components || components.length === 0) {
    await addAllComponentsUseCaseFactory().perform()
    console.log('Components added successfully!')
    return
  }
  console.log('Components not added, as they already exist in the DB!')
}
