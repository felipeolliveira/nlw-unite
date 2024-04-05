import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function EventTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/6">Código</TableHead>
        <TableHead className="w-full">Descrição</TableHead>
        <TableHead className="whitespace-nowrap">Máx. de Inscrições</TableHead>
        <TableHead>Inscritos</TableHead>
        <TableHead className="w-10" />
      </TableRow>
    </TableHeader>
  )
}
