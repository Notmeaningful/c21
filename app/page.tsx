'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANCH_NAME, BRANCH_ADDRESS, BRANCH_PHONE, BRANCH_FAX, BRANCH_EMAIL } from '@/lib/constants';
import { useDarkMode } from '@/lib/contexts/DarkModeContext';

export default function Home() {
  const { isDark, toggle } = useDarkMode();
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.getElementById('site-footer');
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      setNearFooter(rect.top < window.innerHeight + 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-gray-900 transition-colors">
      {/* Fixed bottom-right controls */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 transition-all duration-500 ${
        nearFooter ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100'
      }`}>
        <Link
          href="/admin/login"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-c21-gold dark:hover:text-c21-gold transition-all duration-200"
          title="Admin Access"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Admin
        </Link>
        <button
          onClick={toggle}
          className="w-11 h-11 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? (
            <svg className="w-5 h-5 text-c21-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>
      </div>
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background watermark — moved up, more visible */}
        <div className="absolute inset-0 flex items-start justify-center pt-[6vh] sm:pt-[8vh] pointer-events-none select-none">
          <div className="text-center">
            <p className="text-[clamp(60px,14vw,160px)] font-sans font-bold leading-none tracking-[0.08em] uppercase bg-gradient-to-b from-c21-gold/[0.4] via-c21-gold/[0.25] to-transparent bg-clip-text text-transparent">CENTURY 21</p>
            <p className="text-[clamp(18px,3.5vw,44px)] font-semibold tracking-[0.5em] mt-3 uppercase text-c21-gold/[0.4]">VASCO GROUP</p>
            <div className="mx-auto mt-5 h-px w-2/5 bg-gradient-to-r from-transparent via-c21-gold/[0.45] to-transparent" />
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center animate-fadeInUp">
          <h1 className="text-heading-lg mb-4 leading-[1.1]">
            <span className="text-gradient-gold">Questionnaires</span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Access and complete your questionnaires. Quick, secure, and easy to use.
          </p>

          <Link href="/portal" className="btn-primary text-base inline-flex items-center gap-2">
            Go to Portal
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-10 md:p-14 shadow-sm">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-caption mb-3">Contact</p>
              <h2 className="text-heading-md">Century 21 Vasco Group</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto text-sm">Trusted partner in property management with years of experience serving the community.</p>
            </div>

            <div className="divider-gold mb-8 sm:mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div>
                <p className="text-caption mb-2">Location</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{BRANCH_ADDRESS}</p>
              </div>
              <div>
                <p className="text-caption mb-2">Phone</p>
                <a href={`tel:${BRANCH_PHONE}`} className="text-gray-700 dark:text-gray-300 hover:text-c21-gold transition-colors text-sm font-medium">{BRANCH_PHONE}</a>
              </div>
              <div>
                <p className="text-caption mb-2">Email</p>
                <a href={`mailto:${BRANCH_EMAIL}`} className="text-gray-700 dark:text-gray-300 hover:text-c21-gold transition-colors text-sm font-medium break-all">{BRANCH_EMAIL}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-caption mb-3">Get Started</p>
          <h2 className="text-heading-md mb-4">Ready to Begin?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm">
            Log in to your portal to view and complete your questionnaires.
          </p>
          <Link href="/portal" className="btn-primary text-base inline-flex items-center gap-2">
            Go to Portal
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="site-footer" className="bg-[#1a1a1a] dark:bg-black text-gray-300 pt-12 pb-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand & Contact */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-c21-gold font-semibold tracking-wider text-sm mb-1">Vasco Group</p>
              <p className="text-white font-bold text-lg tracking-wide mb-4">CENTURY 21 VASCO GROUP</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{BRANCH_ADDRESS}</p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-c21-gold text-[10px] uppercase tracking-widest font-semibold mr-2">Email</span>
                  <a href={`mailto:${BRANCH_EMAIL}`} className="text-gray-300 hover:text-white transition-colors">{BRANCH_EMAIL}</a>
                </p>
                <p>
                  <span className="text-c21-gold text-[10px] uppercase tracking-widest font-semibold mr-2">Phone</span>
                  <a href={`tel:${BRANCH_PHONE}`} className="text-gray-300 hover:text-white transition-colors">{BRANCH_PHONE}</a>
                </p>
                <p>
                  <span className="text-c21-gold text-[10px] uppercase tracking-widest font-semibold mr-2">Fax</span>
                  <span className="text-gray-400">{BRANCH_FAX}</span>
                </p>
              </div>

              {/* Follow Us */}
              <div className="mt-6">
                <p className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a href="https://www.facebook.com/share/1DZKGazhWS/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-c21-gold flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://www.instagram.com/c21vasco?igsh=MXRib3Zuczdndmlraw%3D%3D" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-c21-gold flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  {/* X (Twitter) */}
                  <a href="https://x.com/c21australia?s=21" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-c21-gold flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* YouTube */}
                  <a href="https://youtube.com/@c21vascogroup?si=iEnNJ813t5eizKGk" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-c21-gold flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Buy */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Buy</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-default">Residential Properties for Sale</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Commercial Properties for Sale</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Open For Inspection</span></li>
              </ul>
            </div>

            {/* Rent */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Rent</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-default">Commercial Properties for Rent</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Residential Properties for Rent</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Rentals Open For Inspection</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Request a Rental Appraisal</span></li>
              </ul>
            </div>

            {/* Sell */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Sell</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="hover:text-white transition-colors cursor-default">Projects Properties Sold</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Commercial Properties Sold</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Residential Properties Sold</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Request An Appraisal</span></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700/50 mb-6" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="hover:text-gray-300 transition-colors cursor-default">Disclaimer</span>
              <span className="hover:text-gray-300 transition-colors cursor-default">Privacy Policy</span>
              <span className="hover:text-gray-300 transition-colors cursor-default">Century 21 Australia</span>
              <Link href="/admin/login" className="text-gray-500 hover:text-c21-gold transition-colors uppercase tracking-wider">
                Staff Login
              </Link>
            </div>
            <p>Copyright &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
