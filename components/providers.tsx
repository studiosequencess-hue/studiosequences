import React from 'react'
import AuthProvider from '@/components/providers/auth-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import QueryProvider from '@/components/providers/query-provider'

type Props = {
  children: React.ReactNode
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

export default Providers
