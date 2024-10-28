import { Outlet, useLoaderData } from '@remix-run/react'
import DashboardLayout from '@/components/DashboardLayout'
import { findUser, IUser } from '@/.server/user'
import { json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { getSession } from '@/.server/session'

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession(request)

  if (session.has('userId')) {
    const uid = session.get('userId')
    const user = await findUser({ id: uid })
    return json({ id: user.id, name: user.name, email: user.email })
  }
  return json(null)
}

export default function Dashboard() {
  const user = useLoaderData<IUser>()
  return (
    <DashboardLayout user={user}>
      <Outlet context={user} />
    </DashboardLayout>
  )
}
