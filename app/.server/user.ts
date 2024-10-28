import prisma from './prisma'
import { randomBytes, pbkdf2Sync } from 'crypto'

export interface IUser {
  id: number
  name: string
  email: string
}
export const createUser = async (
  email: string,
  name: string,
  password: string
): Promise<IUser> => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    throw new Error('User already exists!')
  }

  const salt = randomBytes(32).toString('hex')

  const hashedPassword = pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    'sha512'
  ).toString('hex')

  try {
    const newUser = await prisma.user.create({
      data: { email, name, hashedPassword, salt },
    })
    return { id: newUser.id, name: newUser.name, email: newUser.email }
  } catch (error) {
    console.error('error', error)
    throw new Error('Error creating a user in database')
  }
}

export const findUser = async ({
  id,
  email,
}: {
  id?: number
  email?: string
}) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id, email } })
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    hashedPassword: user.hashedPassword,
    salt: user.salt,
  }
}
