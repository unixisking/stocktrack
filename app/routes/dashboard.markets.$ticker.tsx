import { useParams } from '@remix-run/react'

export default function CompanyProfilePage() {
  const { ticker } = useParams()
  return <div>Hello {ticker}</div>
}
