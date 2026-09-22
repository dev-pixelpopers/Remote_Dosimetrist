'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePreloader } from './PreloaderContext'

export default function Header() {
  const { alreadyShown } = usePreloader()
  const wrapperRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const animatedUnderlineClass =
    "relative inline-block pb-[2px] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-full after:bg-[#003777] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"

  useEffect(() => {
    if (alreadyShown && wrapperRef.current) {
      wrapperRef.current.style.top = '0px'
    }
  }, [alreadyShown])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/areas', label: 'Areas of Focus' },
    { to: '/plans', label: 'Our Plans' },
    { to: '/process', label: 'Process' },
    { to: '/systems', label: 'Systems' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact Us' },
  ]

  return (
    <header className="relative w-full bg-white z-20">
      <div
        ref={wrapperRef}
        className="mx-auto px-6 4xl:px-35 flex items-center justify-between h-20 py-5.5 relative -top-20"
        style={{ transition: 'top 1s ease-in' }}
      >
        {/* Desktop left nav */}
        <nav className="hidden lg:flex space-x-[30px]">
          <Link href="/" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Home</Link>
          <Link href="/about" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>About Us</Link>
          <Link href="/areas" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Areas of Focus</Link>
          <Link href="/plans" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Our Plans</Link>
          <Link href="/blog" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Blog</Link>
        </nav>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="relative block h-10 w-[180px] xl:h-12 xl:w-[220px]">
            <Image
              src="/assets/logo-main.png"
              alt="Remote Dosimetrist Logo"
              fill
              sizes="(max-width: 1280px) 180px, 220px"
              className="object-contain object-left"
            />
          </Link>
        </div>

        {/* Desktop right nav + CTA */}
        <div className="hidden lg:flex items-center space-x-[20px]">
          <nav className="flex space-x-[30px]">
            <Link href="/how-it-works" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>How it works</Link>
            <Link href="/process" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Process</Link>
            <Link href="/faq" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Faqs</Link>
            <Link href="/contact" className={`${animatedUnderlineClass} hover:text-[#003777] text-gray-800 font-bold text-md transition-colors capitalize`}>Contact Us</Link>
          </nav>
          <a
            href="/#get-in-touch"
            className="bg-gray-800 text-white! px-5 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            GET IN TOUCH
          </a>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="lg:hidden flex flex-col justify-center gap-[5px] p-2 bg-transparent border-none cursor-pointer rounded-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-[2px] w-6 bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
          <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
          <span className={`block h-[2px] w-6 bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Mobile menu header row */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
          <Link href="/" onClick={() => setMenuOpen(false)} className="relative block h-10 w-[180px]">
            <Image
              src="/assets/logo-main.png"
              alt="Remote Dosimetrist Logo"
              fill
              sizes="180px"
              className="object-contain object-left"
            />
          </Link>
          <button
            className="flex flex-col justify-center gap-[5px] p-2 bg-transparent border-none cursor-pointer rounded-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="block h-[2px] w-6 bg-gray-800 rotate-45 translate-y-[7px] origin-center"></span>
            <span className="block h-[2px] w-6 bg-gray-800 opacity-0"></span>
            <span className="block h-[2px] w-6 bg-gray-800 -rotate-45 -translate-y-[7px] origin-center"></span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-8 pt-6 gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              onClick={() => setMenuOpen(false)}
              className="text-gray-800 font-bold text-lg hover:text-[#003777] transition-colors py-4 border-b border-gray-100"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-8 mt-8">
          <a
            href="/#get-in-touch"
            onClick={() => setMenuOpen(false)}
            className="block text-center bg-gray-800 text-white px-5 py-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors text-sm font-medium uppercase tracking-widest"
          >
            GET IN TOUCH
          </a>
        </div>
      </div>
    </header>
  )
}
