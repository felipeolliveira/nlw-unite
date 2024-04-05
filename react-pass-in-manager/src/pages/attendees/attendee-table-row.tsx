import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { dayjs } from '@/lib/dayjs'
import { AttendeeModel } from '@/models/attendee-model'

type AttendeeTableRowProps = {
  attendee: AttendeeModel
}

export function AttendeeTableRow({ attendee }: AttendeeTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox className="border-muted-foreground" />
      </TableCell>
      <TableCell>{attendee.id.split('-')[0]}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">{attendee.name}</span>
          <span>{attendee.email}</span>
        </div>
      </TableCell>
      <TableCell>{dayjs(attendee.createdAt).fromNow()}</TableCell>
      <TableCell>
        {attendee.checkedInAt ? (
          dayjs(attendee.checkedInAt).fromNow()
        ) : (
          <span className="text-muted-foreground">Não fez check-in</span>
        )}
      </TableCell>
      <TableCell>
        <Button size="icon-sm" variant="outline">
          <MoreHorizontal className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
