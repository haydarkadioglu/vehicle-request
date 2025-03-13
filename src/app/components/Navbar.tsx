"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSoforLoggedIn, setIsSoforLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if sofor is logged in when component mounts
    const soforLoggedIn = localStorage.getItem('soforLoggedIn') === 'true';
    setIsSoforLoggedIn(soforLoggedIn);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* Logo */}
            <div>
              <Link
                href="/"
                className="flex items-center py-5 px-2 text-white font-bold"
              >
                <span className="text-xl">Araç Talep Sistemi</span>
              </Link>
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`py-5 px-3 text-white hover:bg-blue-700 transition duration-300 ${isActive('/')}`}
            >
              Talep Oluştur
            </Link>
            <Link
              href="/talepler"
              className={`py-5 px-3 text-white hover:bg-blue-700 transition duration-300 ${isActive('/talepler')}`}
            >
              Taleplerim
            </Link>
            <Link
              href={isSoforLoggedIn ? "/sofor" : "/sofor/giris"}
              className={`py-5 px-3 text-white hover:bg-blue-700 transition duration-300 ${
                pathname.startsWith('/sofor') ? 'bg-blue-700' : ''
              }`}
            >
              Yetkili Ekranı
            </Link>
            {/* Admin link removed as requested */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="mobile-menu-button outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <Link
          href="/"
          className={`block py-3 px-4 text-white hover:bg-blue-700 transition duration-300 ${isActive('/')}`}
          onClick={() => setIsOpen(false)}
        >
          Talep Oluştur
        </Link>
        <Link
          href="/talepler"
          className={`block py-3 px-4 text-white hover:bg-blue-700 transition duration-300 ${isActive('/talepler')}`}
          onClick={() => setIsOpen(false)}
        >
          Talep Ekranı
        </Link>
        <Link
          href={isSoforLoggedIn ? "/sofor" : "/sofor/giris"}
          className={`block py-3 px-4 text-white hover:bg-blue-700 transition duration-300 ${
            pathname.startsWith('/sofor') ? 'bg-blue-700' : ''
          }`}
          onClick={() => setIsOpen(false)}
        >
          Yetkili Ekranı
        </Link>
        {/* Admin link removed from mobile menu as well */}
      </div>
    </nav>
  );
};

export default Navbar;