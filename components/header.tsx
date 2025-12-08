import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-b-black/10 backdrop-blur-[20px] bg-white/90">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link href={"/"}>
                        <h1 className="font-display text-2xl font-bold text-primary-dark">Studio Sequence</h1>
                    </Link>
                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className="text-primary-dark hover:text-accent-terracotta transition-colors">Discover</Link>
                        <Link href="/" className="text-primary-dark hover:text-accent-terracotta transition-colors">Companies</Link>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button id="searchToggle" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                    <button className="bg-primary-dark text-primary-light px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
                        Sign In
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;