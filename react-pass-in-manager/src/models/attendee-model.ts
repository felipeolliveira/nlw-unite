export interface AttendeeModel {
  id: string
  name: string
  ticketCode: string
  email: string
  createdAt: string
  checkedInAt: string | null
}
