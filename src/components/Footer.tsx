import React from "react";
import { ActivePage } from "../types";
import { COMPANY_DETAILS, SERVICES_DATA } from "../data";
import { MapPin, Phone, Mail, Clock, Truck, ArrowRight } from "lucide-react";

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  onRequestQuote: () => void;
}

export default function Footer({ setActivePage, onRequestQuote }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="site-footer" className="relative bg-[#0f172a] border-t border-slate-800/60 pt-16 pb-8 text-slate-300 select-none">
      {/* Decorative Top Accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleLinkClick("home")}>
              <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-blue-700 text-white transition-colors duration-300 shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-tight font-sans">
                  SUPERIOR
                </span>
                <span className="text-[10px] uppercase tracking-widest text-sky-400 font-black font-mono">
                  Truck GPS
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {COMPANY_DETAILS.description}
            </p>
            <div className="pt-2 flex flex-col gap-2 font-mono text-xs">
              <span className="text-slate-400">FMCSA Registered Logbooks</span>
              <span className="text-sky-400 font-semibold">USDOT ID: #3614279</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase font-mono relative pb-2 border-b border-slate-800 max-w-[100px]">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleLinkClick("home")}
                  className="hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-400" />
                  <span>Home Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("services")}
                  className="hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-400" />
                  <span>Our Logistics Services</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("about")}
                  className="hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-400" />
                  <span>About Our Company</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("contact")}
                  className="hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-400" />
                  <span>Contact & Location</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Services */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase font-mono relative pb-2 border-b border-slate-800 max-w-[100px]">
              Our Core
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICES_DATA.slice(0, 4).map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => handleLinkClick("services")}
                    className="hover:text-sky-400 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-400" />
                    <span className="truncate">{srv.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location & Operating Hours */}
          <div className="space-y-4 text-sm">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase font-mono relative pb-2 border-b border-slate-800 max-w-[100px]">
              Coordinates
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <span className="text-slate-300 leading-relaxed">
                  Nationwide Fleet Services, USA
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9]/g, "")}`} className="hover:text-white transition-colors">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-white transition-colors truncate">
                  {COMPANY_DETAILS.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-1" />
                <div className="text-xs text-slate-400">
                  <p className="text-sky-300 font-semibold uppercase tracking-wider text-[10px]">Technical Support Desk:</p>
                  <p>Online Support: 24/7/365</p>
                  <p className="text-emerald-400 font-semibold font-mono">Driver Helpline: (973) 932-4796</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p>© {currentYear} {COMPANY_DETAILS.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Licensed & Insured</span>
            <span>•</span>
            <a
              id="iwebnext-backlink"
              href="https://iwebnext.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 hover:underline transition-all font-semibold"
            >
              Developed by iWebNext
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
