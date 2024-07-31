import { useMatches } from '@remix-run/react'

export default function Homepage() {
  const matches = useMatches()
  console.log('matches', matches)
  return <div>Hello dashboard homepage</div>
}
