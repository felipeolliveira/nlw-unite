import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/layouts/root-layout'
import { AttendeesPage } from '@/pages/attendees/page'
import { EventsPage } from '@/pages/events/page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <EventsPage />,
      },
      {
        path: '/:eventSlug/attendees',
        element: <AttendeesPage />,
      },
    ],
  },
])
