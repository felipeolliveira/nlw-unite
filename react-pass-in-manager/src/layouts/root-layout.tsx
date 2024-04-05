import { Outlet } from 'react-router-dom'

import { Header } from '@/components/header'
import { PageContainer } from '@/components/page-container'

export function RootLayout() {
  return (
    <PageContainer className="space-y-5">
      <Header />
      <Outlet />
    </PageContainer>
  )
}
