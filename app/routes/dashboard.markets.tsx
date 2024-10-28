import { Outlet, useParams } from '@remix-run/react'

export default function Settings() {
  const { ticker } = useParams()
  console.log('props', ticker)
  if (ticker) {
    return <Outlet />
  } else {
    return <div>Markets page</div>
  }
}
