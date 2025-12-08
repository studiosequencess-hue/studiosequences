import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-primary-dark text-primary-light py-12 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <h3 className="font-display text-2xl font-bold mb-4">Studio Sequence</h3>
                <p className="text-gray-400 mb-6">Connecting creative professionals worldwide</p>
                <div className="flex justify-center space-x-6 mb-8">
                    <Link href="/"
                          className="text-gray-400 hover:text-white transition-colors">About</Link>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
                    <Link href="/"
                          className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                </div>
                <p className="text-gray-500 text-sm">&copy; 2024 Studio Sequence. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;