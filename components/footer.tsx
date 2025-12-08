import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-primary-light px-6 py-12">
      <div className="mx-auto max-w-7xl text-center">
        <h3 className="font-display mb-4 text-2xl font-bold">
          Studio Sequence
        </h3>
        <p className="mb-6 text-gray-400">
          Connecting creative professionals worldwide
        </p>
        <div className="mb-8 flex justify-center space-x-6">
          <Link
            href="/"
            className="text-gray-400 transition-colors hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/"
            className="text-gray-400 transition-colors hover:text-white"
          >
            Terms
          </Link>
          <Link
            href="/"
            className="text-gray-400 transition-colors hover:text-white"
          >
            Contact
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          &copy; 2024 Studio Sequence. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
