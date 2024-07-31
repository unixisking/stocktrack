import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { findUser } from '~/.server/user'

interface IUser {
  id: string
  name: string
  email: string
}

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const user_id = new URL(request.url).searchParams.get('id')

  try {
    const user = await findUser({ id: Number(user_id) })
    return { id: user.id, name: user.name, email: user.email }
  } catch (error) {
    console.error(
      'Invalid ID, please check if user with that ID exist in DB',
      error
    )
    throw new Error('Invalid link')
  }
}
export default function VerifyEmail() {
  const data = useLoaderData<IUser>()

  if (data?.name) {
    return <p>Thanks for verifying your email {data?.name} </p>
  }
  return null
}
