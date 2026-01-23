import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import ProjectsPartials from '@/components/partials/projects/projects.partials'
import Providers from '@/components/providers'

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
          <Header />
          <main className={'flex h-full w-full flex-1 flex-col'}>
            {children}
          </main>
          <Footer />

          <Toaster />
          <ProjectsPartials />
        </Providers>
      </body>
    </html>
  )
}
