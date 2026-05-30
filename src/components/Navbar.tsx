import React, { useState, useEffect } from "react";
import { ActivePage } from "../types";
import { COMPANY_DETAILS } from "../data";
import { Menu, X, Phone, Truck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onRequestQuote: () => void;
}

export default function Navbar({ activePage, setActivePage, onRequestQuote }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll listener to toggle header high-performance styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "services", label: "Features & Pricing" },
    { id: "about", label: "About App" },
    { id: "contact", label: "Support Desk" },
  ];

  const handleNavClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 border-b border-slate-250 shadow-md shadow-slate-100/50 backdrop-blur-md"
          : "bg-white/85 border-b border-slate-150 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand Title */}
          <div
            id="brand-logo"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="bg-blue-900 w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-blue-850 text-white transition-colors duration-300 shadow-md shadow-blue-900/10 shrink-0">
              <Truck id="logo-icon" className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span id="brand-main-name" className="text-xl font-extrabold tracking-tight text-slate-900 uppercase italic leading-none font-sans">
                Superior
              </span>
              <span id="brand-sub-name" className="text-[10px] uppercase tracking-widest text-blue-650 font-black font-mono mt-0.5">
                Truck GPS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  activePage === item.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <motion.span
                    layoutId="activeBubbleNav"
                    className="absolute inset-0 rounded-full border border-blue-500/20 pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Call to Actions */}
          <div id="desktop-actions" className="hidden lg:flex items-center gap-4">
            {/* Direct Dial Hotline */}
            <a
              id="hotline-link"
              href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 text-sm font-semibold transition-colors border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg"
            >
              <Phone className="w-4 h-4 text-blue-600 animate-pulse-slow" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>

            {/* Request Quote Button */}
            <button
              id="request-quote-button"
              onClick={onRequestQuote}
              className="relative overflow-hidden group px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-all duration-300 shadow-md shadow-blue-600/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="relative z-10-navbar">14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div id="mobile-menu-toggle" className="flex items-center gap-3 md:hidden">
            <a
              id="mobile-phone-link"
              href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9]/g, "")}`}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-blue-600 border border-slate-200"
              aria-label="Call Dispatch Support"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              id="hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-605 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 shadow-lg backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              <div className="flex flex-col gap-1 px-2 pt-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-150 cursor-pointer ${
                      activePage === item.id
                        ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-200 px-2 space-y-3">
                <div className="text-xs text-slate-400 px-4">
                  Superior Truck GPS | Nationwide Operations
                </div>
                <a
                  id="mobile-nav-hotline"
                  href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-blue-600 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
                >
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>Call {COMPANY_DETAILS.phone}</span>
                </a>
                <button
                  id="mobile-nav-quote"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onRequestQuote();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 active:bg-blue-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
