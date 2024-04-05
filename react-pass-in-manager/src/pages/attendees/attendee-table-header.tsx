import { Checkbox } from '@/components/ui/checkbox'
import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AttendeeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox className="border-muted-foreground" />
        </TableHead>
        <TableHead>Código</TableHead>
        <TableHead>Participantes</TableHead>
        <TableHead>Data de Inscrição</TableHead>
        <TableHead>Data do CheckIn</TableHead>
        <TableHead className="w-16" />
      </TableRow>
    </TableHeader>
  )
}
