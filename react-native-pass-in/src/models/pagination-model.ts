export interface PaginationModel<T> {
  resource: "events" | "attendees",
  data: Array<T>,
  totalItems: number,
  totalPages: number,
  currentPage: number
}