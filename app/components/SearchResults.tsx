import { Link } from '@remix-run/react'
import { useHits } from 'react-instantsearch'

export default function SearchResults({
  isOpen,
  onMouseDown,
}: {
  isOpen: boolean
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void
}) {
  const { items, results } = useHits()
  if (
    results &&
    results.nbHits > 0 &&
    results?.query != '' &&
    isOpen === true
  ) {
    return (
      <div
        onMouseDown={onMouseDown}
        className="absolute w-full bg-white float-left py-2 px-1 z-10 rounded-md space-y-4 shadow-md"
      >
        {items.map((item) => (
          <Link key={item.objectID} href={`/dashboard/markets/${item.ticker}`}>
            <div className="text-left px-2 py-1 hover:bg-green-100 cursor-pointer">
              <div direction={'column'}>
                <h3 className="font-bold">{item.security}</h3>
                <p className="text-sm">{item.industry}</p>
                <p className="text-sm text-gray-400">{item.ticker}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  } else return null
}
