'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-9 w-9 p-2" /> // Skeleton/spacer

  return (
    <Button
      size={'sm'}
      variant={'ghost'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="mx-4 h-fit w-fit rounded-md p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ThemeToggler
