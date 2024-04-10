import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus, Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EventModel } from '@/models/event-model'
import { PaginationModel } from '@/models/pagination-model'

import { EventTable } from './event-table'
import { NewEventDialog } from './new-event-dialog'

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const isOpenNewEventDialog = searchParams.get('dialog') === 'new-event'
  const page = z.coerce.number().parse(searchParams.get('page') ?? 1) - 1
  const perPage = 10
  const searchText = searchParams.get('search') ?? ''
  const sanitizatedSearch = searchText?.replace(/\s/g, '').toLowerCase()

  const { data: events, isLoading } = useQuery<PaginationModel<EventModel>>({
    queryKey: ['events', page, sanitizatedSearch],
    queryFn: async () => {
      const url = new URL('http://localhost:8080/events')

      url.searchParams.set('page', page.toString())
      url.searchParams.set('size', perPage.toString())
      url.searchParams.set('search', searchText)

      const response = await fetch(url)
      const body = await response.json()
      return body
    },
  })

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchParams((query) => {
      query.set('search', event.target.value)
      return query
    })
    handlePageChange(0)
  }

  function handlePageChange(pageIndex: number) {
    setSearchParams((query) => {
      query.set('page', (pageIndex + 1).toString())
      return query
    })
  }

  function handleOpenNewEventDialog(isOpen: boolean) {
    setSearchParams((query) => {
      if (!isOpen) {
        query.delete('dialog')
      } else {
        query.set('dialog', 'new-event')
      }
      return query
    })
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="flex-1 text-2xl font-bold">Eventos</h1>
          <Button
            className="gap-2"
            onClick={() => handleOpenNewEventDialog(true)}
            variant="secondary"
          >
            <Plus className="size-4" />
            novo evento
          </Button>
          <div className="group relative">
            <Search className="absolute left-3 top-3 size-4 text-primary" />
            <Input
              className="pl-10"
              onChange={handleSearch}
              placeholder="Buscar eventos..."
              value={searchText}
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

      <NewEventDialog
        isOpen={isOpenNewEventDialog}
        onOpenChange={handleOpenNewEventDialog}
      />
    </>
  )
}
