'use client'
import Image from 'next/image'
import Link from 'next/link'
import { IconLinkedin, IconFacebook, IconInstagram, IconTwitter } from '@/components/SiteIcons'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-white relative">
      {/* Content Section */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Logo + Social */}
          <div className="flex flex-col justify-center items-center xl:items-start mx-auto w-full max-w-sm">
            <div className="w-full">
              <Link href="/" className="relative mx-auto block h-16 w-[220px] xl:mx-0">
                <Image
                  src="/assets/logo-main.png"
                  alt="Remote Dosimetrist"
                  fill
                  sizes="220px"
                  className="object-contain object-left"
                />
              </Link>
            </div>
            <div className="flex space-x-8 mt-6">

              <a href="https://www.facebook.com/remotedosimetry.services" aria-label="Facebook" className="text-[#003777] hover:text-blue-800 inline-flex"><IconFacebook className="h-4.75 w-auto" /></a>
              <a href="https://www.instagram.com/remote_dosimetry" aria-label="Instagram" className="text-[#003777] hover:text-blue-800 inline-flex"><IconInstagram className="h-4.75 w-auto" /></a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center md:justify-start space-x-12 pt-8 md:pt-14 mx-auto">
            <div className="flex flex-col space-y-4 text-xs font-bold tracking-widest text-[#595959] uppercase">
              <Link href="/" className="hover:text-[#003777]">Home</Link>
              <Link href="/about" className="hover:text-[#003777]">About</Link>
              <Link href="/areas" className="hover:text-[#003777]">Areas of Focus</Link>
              <Link href="/plans" className="hover:text-[#003777]">Our Plans</Link>
            </div>
            <div className="flex flex-col space-y-4 text-xs font-bold tracking-widest text-[#595959] uppercase">
              <Link href="/process" className="hover:text-[#003777]">Process</Link>
              <Link href="/systems" className="hover:text-[#003777]">Systems</Link>
              <Link href="/how-it-works" className="hover:text-[#003777]">How it Works</Link>
              <Link href="/faq/" className="hover:text-[#003777]">FAQ</Link>
              <Link href="/contact" className="hover:text-[#003777]">Contact</Link>
            </div>
          </div>

          {/* Our Location */}
          <div className="flex flex-col items-center md:items-start mx-auto w-full">
            <h3 className="text-[#003777] font-bold text-xl tracking-widest mb-6 uppercase">Our Location</h3>
            <div className="w-full h-48 bg-gray-200 overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d172152.96028656402!2d-122.5046031028646!3d47.608828458612244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490102c93e83355%3A0x102565466944d59a!2sSeattle%2C%20WA%2C%20USA!5e0!3m2!1sen!2s!4v1774540477222!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Remote Dosimetrist Location - Seattle, WA"
                className="opacity-70 grayscale"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full bg-[#003777] py-4 text-center">
        <p className="text-white text-[10px] lg:text-[15px] tracking-widest font-normal">
          Copyright © {currentYear}. <span className="font-bold">REMOTE DOSIMETRIST</span>. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
