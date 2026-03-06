import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-primary-light flex flex-col items-center justify-between gap-3 px-6 py-8 text-center lg:flex-row">
      <div className={'flex flex-col items-center gap-3 lg:flex-row'}>
        <h3 className="font-bold">Flare</h3>
        <p className="text-muted-foreground">Flare app all rights preserved</p>
      </div>
      <p>Connecting creative professionals worldwide</p>
      <div className="flex flex-col items-center gap-3 lg:flex-row">
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-white"
        >
          Privacy
        </Link>
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-white"
        >
          Terms
        </Link>
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-white"
        >
          Contact
        </Link>
      </div>
    </footer>
  )
}

export default Footer
