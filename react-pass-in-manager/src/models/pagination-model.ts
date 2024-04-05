export interface PaginationModel<T> {
  resource: string
  data: Array<T>
  totalItems: number
  totalPages: number
  currentPage: number
}
