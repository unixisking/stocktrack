import { useState, useRef, useEffect } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch'
import SearchResults from './SearchResults'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search as SearchIcon } from 'lucide-react'

export default function Search(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props)
  const [inputValue, setInputValue] = useState(query)
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function setQuery(newQuery: string) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return (
    <div id="search-box" className="relative w-full" ref={ref}>
      <form role="search" noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Input
            className="pl-10 pr-4 py-2"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Search for products"
            spellCheck={false}
            maxLength={512}
            type="search"
            value={inputValue}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onFocus={() => setIsOpen(true)}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute left-0 top-0 h-full px-3"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {isOpen && (
        <SearchResults
          onMouseDown={(event) => event.preventDefault()}
          isOpen={isOpen}
        />
      )}
    </div>
  )
}
