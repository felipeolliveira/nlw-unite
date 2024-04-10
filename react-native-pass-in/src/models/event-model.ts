export interface EventModel {
  id: string;
  title: string;
  details: string;
  slug: string;
  imageUrl: string | null;
  maximumAttendees: number;
  attendeesAmount: number;
}
