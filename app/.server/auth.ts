// import { Auth0Strategy } from 'remix-auth-auth0'

import { pbkdf2Sync } from 'crypto'

import { findUser } from './user'
import { ServerError } from '@/utils/error'

export const login = async (email: string, password: string) => {
  const isUser = await findUser({ email })
  const { salt, hashedPassword } = isUser

  const loginHashedPassword = pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    'sha512'
  ).toString('hex')

  if (hashedPassword !== loginHashedPassword) {
    throw new ServerError({
      message: 'Passwords do not match, please try again',
      status: 500,
      context: 'login',
    })
  }
  return isUser
}
