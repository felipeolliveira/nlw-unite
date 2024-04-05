// export type PaginationProps = {}

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from './ui/button'

type PaginationActions = 'first' | 'prev' | 'next' | 'last'

type PaginationProps = {
  pageIndex: number
  perPage: number
  totalItems: number
  onPageChange: (pageIndex: number, action: PaginationActions) => void
}

export function Pagination({
  pageIndex,
  perPage,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage)

  function handleChangePage(action: PaginationActions) {
    let newPageIndex = pageIndex

    switch (action) {
      case 'first':
        if (pageIndex > 0) newPageIndex = 0
        break
      case 'prev':
        if (pageIndex > 0) newPageIndex -= 1
        break
      case 'next':
        if (pageIndex < totalPages - 1) newPageIndex += 1
        break
      case 'last':
        if (pageIndex < totalPages - 1) newPageIndex = totalPages - 1
        break
    }

    return () => {
      onPageChange(newPageIndex, action)
    }
  }

  return (
    <div className="flex items-center justify-end gap-8">
      Página {pageIndex + 1} de {totalPages}
      <div className="flex items-center gap-1.5">
        <Button
          className="bg-zinc-300/50 dark:bg-zinc-300/10 "
          disabled={pageIndex < 1}
          onClick={handleChangePage('first')}
          size="icon-sm"
          variant="outline"
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          className="bg-zinc-300/50 dark:bg-zinc-300/10 "
          disabled={pageIndex < 1}
          onClick={handleChangePage('prev')}
          size="icon-sm"
          variant="outline"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          className="bg-zinc-300/50 dark:bg-zinc-300/10 "
          disabled={pageIndex >= totalPages - 1}
          onClick={handleChangePage('next')}
          size="icon-sm"
          variant="outline"
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          className="bg-zinc-300/50 dark:bg-zinc-300/10 "
          disabled={pageIndex >= totalPages - 1}
          onClick={handleChangePage('last')}
          size="icon-sm"
          variant="outline"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
