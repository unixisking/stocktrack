import { Outlet } from '@remix-run/react'
import DashboardLayout from '~/components/DashboardLayout'

export default function Dashboard() {
  return (
    <div>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  )
}
