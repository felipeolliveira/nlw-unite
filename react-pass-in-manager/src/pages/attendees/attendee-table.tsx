import { Pagination } from '@/components/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import { AttendeeModel } from '@/models/attendee-model'
import { PaginationModel } from '@/models/pagination-model'

import { AttendeeTableHeader } from './attendee-table-header'
import { AttendeeTableRow } from './attendee-table-row'

export type AttendeeTableProps = {
  page: number
  perPage: number
  attendees: PaginationModel<AttendeeModel>
  onPageChange: (page: number) => void
}

export function AttendeeTable({
  page,
  onPageChange,
  perPage,
  attendees,
}: AttendeeTableProps) {
  const showingItems =
    perPage * (page + 1) > attendees.totalItems
      ? attendees.totalItems
      : perPage * (page + 1)

  return (
    <div className="rounded-lg border  border-zinc-400 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
      <Table>
        <AttendeeTableHeader />

        <TableBody>
          {attendees.data.map((attendee) => (
            <AttendeeTableRow
              attendee={attendee}
              key={`${attendee.id}-${attendee.email}`}
            />
          ))}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell colSpan={3}>
              Mostrando {showingItems} de {attendees.totalItems} itens
            </TableCell>
            <TableCell colSpan={3}>
              <Pagination
                onPageChange={onPageChange}
                pageIndex={page}
                perPage={perPage}
                totalItems={attendees.totalItems}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
