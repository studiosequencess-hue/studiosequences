import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

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
      <body className={`${inter.className} relative bg-black antialiased`}>
        <Header />
        <main className={'flex h-full w-full flex-grow flex-col'}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
