'use client';

import { BRANCH_NAME, BRANCH_PHONE, BRANCH_EMAIL } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDarkMode } from '@/lib/contexts/DarkModeContext';

export function Navbar() {
  const pathname = usePathname();
  const isPortalPage = pathname?.startsWith('/portal') || pathname?.startsWith('/q/');
  const isHomePage = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark } = useDarkMode();

  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  // Don't show navbar on portal/questionnaire fill pages (they have their own header)
  if (isPortalPage) return null;

  const isTransparent = isHomePage && !scrolled && !mobileOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isTransparent
          ? 'bg-[#faf8f5] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/60'
          : 'liquid-glass border-b border-white/20 dark:border-white/10'
      }`}
      style={!isTransparent ? (isDark ? {
        background: 'linear-gradient(135deg, rgba(17,24,39,0.65) 0%, rgba(17,24,39,0.4) 50%, rgba(17,24,39,0.65) 100%)',
        backdropFilter: 'blur(24px) saturate(1.6) brightness(0.9)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6) brightness(0.9)',
        boxShadow: '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 32px -8px rgba(0,0,0,0.3), 0 2px 8px -2px rgba(0,0,0,0.2)',
      } : {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.55) 100%)',
        backdropFilter: 'blur(24px) saturate(1.8) brightness(1.05)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8) brightness(1.05)',
        boxShadow: '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 8px 32px -8px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)',
      }) : undefined}
    >
      {/* Liquid glass highlight edge */}
      {!isTransparent && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 dark:via-white/15 to-transparent pointer-events-none" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/c21-logo.svg" alt="Century 21 Vasco Group" className="h-10 sm:h-12" />
        </Link>

        <div className="flex-1" />

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 transition-colors ${isTransparent ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' : 'text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>

        <div className="hidden md:flex flex-col text-right text-sm">
          <a href={`tel:${BRANCH_PHONE}`} className={`transition-colors text-sm ${isTransparent ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
            {BRANCH_PHONE}
          </a>
          <a href={`mailto:${BRANCH_EMAIL}`} className="text-c21-gold text-xs hover:text-c21-gold/80 transition-colors">
            {BRANCH_EMAIL}
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t border-white/20 dark:border-white/10 px-4 sm:px-6 py-4 space-y-3"
          style={isDark ? {
            background: 'rgba(17,24,39,0.7)',
            backdropFilter: 'blur(24px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          } : {
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          }}
        >
          <div className="text-sm">
            <a href={`tel:${BRANCH_PHONE}`} className="block text-c21-gold text-sm">{BRANCH_PHONE}</a>
            <a href={`mailto:${BRANCH_EMAIL}`} className="block text-gray-400 mt-1 text-sm">{BRANCH_EMAIL}</a>
          </div>
        </div>
      )}
    </nav>
  );
}
