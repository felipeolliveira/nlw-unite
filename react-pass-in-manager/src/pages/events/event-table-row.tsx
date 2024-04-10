import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { EventModel } from '@/models/event-model'

import { EventLogo } from './event-logo'

type EventTableRowProps = {
  event: EventModel
  disabled?: boolean
  onClickRow: (slug: string) => void
}

export function EventTableRow({
  event,
  onClickRow,
  disabled,
}: EventTableRowProps) {
  function handleClickRow() {
    if (!disabled) onClickRow(event.slug)
  }

  return (
    <TableRow
      className={cn([
        'cursor-pointer active:bg-primary/10',
        disabled
          ? 'cursor-default hover:bg-transparent active:bg-transparent'
          : null,
      ])}
      onClick={handleClickRow}
    >
      <TableCell>
        <EventLogo imageUrl={event.imageUrl} title={event.title} />
      </TableCell>
      <TableCell>{event.slug}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">{event.title}</span>
          <span>{event.details}</span>
        </div>
      </TableCell>
      <TableCell>{event.maximumAttendees}</TableCell>
      <TableCell>{event.attendeesAmount}</TableCell>
      <TableCell>
        {!disabled && (
          <Button disabled size="icon-sm" variant="outline">
            <ArrowRight className="size-5" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
