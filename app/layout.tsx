import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import ProjectsDialogs from '@/components/partials/projects/projects.dialogs'
import Providers from '@/components/providers'
import CompanyEventsDialogs from '@/components/partials/events/company.events.dialogs'
import ConversationsDialogs from '@/components/partials/messaging/conversations.dialogs'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Studio Sequences',
  description: 'Studio Sequences',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background relative antialiased`}>
        <Providers>
          <div className={'flex min-h-screen grow flex-col'}>
            <Header />
            <main className={'flex grow flex-col'}>{children}</main>
            <Footer />

            <Toaster />
            <ProjectsDialogs />
            <CompanyEventsDialogs />
            <ConversationsDialogs />
          </div>
        </Providers>
      </body>
    </html>
  )
}
