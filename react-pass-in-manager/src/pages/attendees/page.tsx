import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AttendeeModel } from '@/models/attendee-model'
import { EventModel } from '@/models/event-model'
import { PaginationModel } from '@/models/pagination-model'

import { AttendeeTable } from './attendee-table'

export function AttendeesPage() {
  const { eventSlug } = useParams()
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

  const { data: eventDetail } = useQuery<{ event: EventModel }>({
    queryKey: ['event', eventSlug],
    queryFn: async () => {
      const eventUrl = new URL(`http://localhost:8080/events/slug/${eventSlug}`)

      const eventResponse = await fetch(eventUrl)
      const eventBody = await eventResponse.json()

      return eventBody
    },
  })

  const { data: attendees, isLoading } = useQuery<
    PaginationModel<AttendeeModel>
  >({
    queryKey: [eventSlug, 'attendees', page, sanitizatedSearch],
    queryFn: async () => {
      const attendeesUrl = new URL(
        `http://localhost:8080/events/${eventDetail?.event.id}/attendees`,
      )

      attendeesUrl.searchParams.set('page', page.toString())
      attendeesUrl.searchParams.set('size', perPage.toString())
      attendeesUrl.searchParams.set('search', search)

      const response = await fetch(attendeesUrl)
      const body = await response.json()
      return body
    },
    enabled: !!eventDetail,
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
        <div className="flex flex-1 items-center gap-5 overflow-hidden">
          <Link to="/">
            <Button size="icon-sm" variant="ghost">
              <ArrowLeft />
            </Button>
          </Link>
          <span
            className="truncate text-xl font-light text-primary/100"
            title={eventDetail?.event.title}
          >
            {eventDetail?.event.title}
          </span>
          <span className="size-1.5 rounded-full bg-primary/50" />
          <h1 className="flex-1 whitespace-nowrap text-2xl font-bold">
            Participantes
          </h1>
        </div>
        <div className="group relative">
          <Search className="absolute left-3 top-3 size-4 text-primary" />
          <Input
            className="pl-10"
            onChange={handleSearch}
            placeholder="Buscar participante..."
            value={search}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid place-items-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {!attendees?.data && !isLoading && (
        <div className="grid place-items-center">
          <p>Nenhum participante encontrado</p>
        </div>
      )}

      {attendees?.data && (
        <AttendeeTable
          attendees={attendees}
          onPageChange={handlePageChange}
          page={page}
          perPage={perPage}
        />
      )}
    </div>
  )
}
