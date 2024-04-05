import { useNavigate } from 'react-router-dom'

import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import { EventModel } from '@/models/event-model'
import { PaginationModel } from '@/models/pagination-model'

import { EventTableHeader } from './event-table-header'
import { EventTableRow } from './event-table-row'

export type AttendeeTableProps = {
  page: number
  perPage: number
  events: PaginationModel<EventModel>
  onPageChange: (page: number) => void
}

export function EventTable({
  page,
  onPageChange,
  perPage,
  events,
}: AttendeeTableProps) {
  const navigate = useNavigate()

  const showingItems =
    perPage * (page + 1) > events.totalItems
      ? events.totalItems
      : perPage * (page + 1)

  return (
    <div className="rounded-lg border  border-zinc-400 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
      <Table>
        <EventTableHeader />

        <TableBody>
          {events.data.map((event) => (
            <EventTableRow
              disabled={event.attendeesAmount === 0}
              event={event}
              key={event.slug}
              onClickRow={(slug) => navigate(`/${slug}/attendees`)}
            />
          ))}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell colSpan={2}>
              Mostrando {showingItems} de {events.totalItems} itens
            </TableCell>
            <TableCell colSpan={3}>
              <Pagination
                onPageChange={onPageChange}
                pageIndex={page}
                perPage={perPage}
                totalItems={events.totalItems}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
