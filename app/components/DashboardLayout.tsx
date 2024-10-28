'use client'

import { algoliasearch } from 'algoliasearch'
import { SidebarProvider } from './ui/sidebar'
import AppSidebar from './AppSidebar'
import { Configure, InstantSearch } from 'react-instantsearch'

const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID || '',
  process.env.ALGOLIA_SEARCH_API_KEY || ''
)

const DashboardLayout = () => {
  return (
    <InstantSearch indexName="stocks_index" searchClient={algoliaClient}>
      <Configure analytics={false} hitsPerPage={4} />
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </InstantSearch>
  )
}

export default DashboardLayout
