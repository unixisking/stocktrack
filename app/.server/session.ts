import { createCookieSessionStorage, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET env variable must be set')

const USER_SESSION_KEY = 'userId'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['helloworld'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const {
  getSession: getSessionStorage,
  commitSession,
  destroySession,
} = sessionStorage

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie')
  return getSessionStorage(cookie)
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request
  userId: number
  remember: boolean
  redirectTo: string
}) {
  const session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
      }),
    },
  })
}
