import { useQuery } from '@tanstack/react-query'
import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { EventModel } from '@/models/event-model'
import { PaginationModel } from '@/models/pagination-model'

import { EventTable } from './event-table'

export function EventsPage() {
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())
    return Number(url.searchParams.get('page') ?? 1) <= 1
      ? 0
      : Number(url.searchParams.get('page')) - 1
  })
  const perPage = 10

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())
    return url.searchParams.get('search') ?? ''
  })

  const sanitizatedSearch = search.replace(/\s/g, '').toLowerCase()

  const { data: events, isLoading } = useQuery<PaginationModel<EventModel>>({
    queryKey: ['events', page, sanitizatedSearch],
    queryFn: async () => {
      const url = new URL('http://localhost:8080/events')

      url.searchParams.set('page', page.toString())
      url.searchParams.set('size', perPage.toString())
      url.searchParams.set('search', search)

      const response = await fetch(url)
      const body = await response.json()
      return body
    },
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', event.target.value)
    window.history.pushState({}, '', url.toString())

    setSearch(event.target.value)
    handlePageChange(0)
  }

  function handlePageChange(pageIndex: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', (pageIndex + 1).toString())
    window.history.pushState({}, '', url.toString())

    setPage(pageIndex)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="flex-1 text-2xl font-bold">Eventos</h1>
        <div className="group relative">
          <Search className="absolute left-3 top-3 size-4 text-primary" />
          <Input
            className="pl-10"
            onChange={handleSearch}
            placeholder="Buscar eventos..."
            value={search}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid place-items-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {!events?.data && !isLoading && (
        <div className="grid place-items-center">
          <p>Nenhum evento encontrado</p>
        </div>
      )}

      {events?.data && (
        <EventTable
          events={events}
          onPageChange={handlePageChange}
          page={page}
          perPage={perPage}
        />
      )}
    </div>
  )
}
