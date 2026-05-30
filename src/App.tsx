import React, { useState, useEffect } from "react";
import { ActivePage, QuoteFormData, QuoteFormResponse } from "./types";
import { 
  COMPANY_DETAILS, 
  SERVICES_DATA, 
  TESTIMONIALS_DATA, 
  FAQS_DATA, 
  REASONS_TO_CHOOSE_US,
  SEO_KEYWORDS 
} from "./data";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import QuoteModal from "./components/QuoteModal";
import ScrollToTop from "./components/ScrollToTop";

// Dynamic Lucide icons
import { 
  Truck, 
  CalendarRange, 
  Network, 
  ShieldCheck, 
  Timer, 
  Compass, 
  ArrowRight, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Award, 
  Shield, 
  ChevronRight, 
  Check, 
  Loader2, 
  Info,
  Sparkles,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Absolute path to high-quality responsive asset images
const HERO_TRUCK_IMAGE = "/src/assets/images/hero_truck_1780165566888.png";
const DELIVERY_VAN_IMAGE = "/src/assets/images/delivery_van_1780165585246.png";

// Dynamically resolve service icons
function renderServiceIcon(name: string, className = "w-6 h-6") {
  switch (name) {
    case "Truck": return <Truck className={className} />;
    case "CalendarRange": return <CalendarRange className={className} />;
    case "Network": return <Network className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "Timer": return <Timer className={className} />;
    case "Compass": return <Compass className={className} />;
    default: return <Compass className={className} />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeFaqId, setActiveFaqId] = useState<string | null>("faq1");

  // Contact Page Local Form State
  const [contactForm, setContactForm] = useState<QuoteFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "Single Truck 14-Day Free Trial ($10/mo)",
    message: ""
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactResponse, setContactResponse] = useState<QuoteFormResponse | null>(null);

  // States for Interactive GPS Route Simulator
  const [simOrigin, setSimOrigin] = useState("New York, NY");
  const [simDest, setSimDest] = useState("Chicago, IL");
  const [simHeight, setSimHeight] = useState("13-6");
  const [simWeight, setSimWeight] = useState("80000");
  const [simHazmat, setSimHazmat] = useState("None");
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // States for Interactive Load Board
  const [selectedLoadFilter, setSelectedLoadFilter] = useState("All");
  const [bookedLoadId, setBookedLoadId] = useState<string | null>(null);
  const [isBookingProcess, setIsBookingProcess] = useState(false);

  // States for Interactive ELD Log simulator
  const [hosStatus, setHosStatus] = useState<"OFF" | "ON" | "SB" | "DRIVE">("DRIVE");
  const [hosHoursRemaining, setHosHoursRemaining] = useState(11 * 60 + 42); // 11 hours 42 mins in minutes

  // Mock Active Loads
  const MOCK_LOADS = [
    { id: "L01", origin: "Secaucus, NJ", dest: "Columbus, OH", equipment: "Dry Van", rate: 1950, distance: "510 mi", payout: "$1,950", dispatcherContact: "(973) 932-4796", brokerSaved: 390 },
    { id: "L02", origin: "Allentown, PA", dest: "Atlanta, GA", equipment: "Reefer", rate: 3200, distance: "740 mi", payout: "$3,200", dispatcherContact: "(973) 932-4796", brokerSaved: 640 },
    { id: "L03", origin: "Houston, TX", dest: "Dallas, TX", equipment: "Flatbed", rate: 850, distance: "245 mi", payout: "$850", dispatcherContact: "(973) 932-4796", brokerSaved: 170 },
    { id: "L04", origin: "Chicago, IL", dest: "Los Angeles, CA", equipment: "Power Only", rate: 5800, distance: "2015 mi", payout: "$5,800", dispatcherContact: "(973) 932-4796", brokerSaved: 1160 }
  ];

  // Map coordinate dynamic dash phase offset anim
  const [animationOffset, setAnimationOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 100);
    }, 501);
    return () => clearInterval(id);
  }, []);

  // Sync hours remaining
  useEffect(() => {
    let interval: any = null;
    if (hosStatus === "DRIVE") {
      interval = setInterval(() => {
        setHosHoursRemaining(prev => (prev > 0 ? prev - 1 : 11 * 60));
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [hosStatus]);

  // Handle support route selection helper
  const handleLinkClick = (pageId: ActivePage) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Contact Feedback Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in all mandatory fields (Name, Email, Message).");
      return;
    }
    setIsContactSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (res.ok) {
        setContactResponse({
          success: true,
          message: data.message,
          reference: data.reference
        });
        setContactForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          serviceType: "Single Truck 14-Day Free Trial ($10/mo)",
          message: ""
        });
      } else {
        setContactResponse({ success: false, error: data.error });
      }
    } catch {
      setContactResponse({
        success: false,
        error: "Our local dispatch connection is momentarily offline. Please touch base directly at (973) 932-4796 for immediate onboarding!"
      });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  // Simulated GPS auditor action
  const runSimulatedAudit = () => {
    setIsSimulatingRoute(true);
    setSimResult(null);

    setTimeout(() => {
      setIsSimulatingRoute(false);
      const isDangerousHeight = simHeight === "14-2" || simHeight === "15-0";
      const isDangerousWeight = parseInt(simWeight.replace(/[^0-9]/g, "")) > 80000;

      let avoidedBridgeHeight = "11ft 4in";
      let bypassedHazards = [];
      let routingSafetyCode = "SECURE_TRUCK_APPROVED";

      if (isDangerousHeight) {
        bypassedHazards.push("Low bridge overpass avoided: 11'4\" clearance on commercial bypass Parkway.");
        routingSafetyCode = "RESTRIBUTION_RE-ROUTE_COMPLETE";
      }
      if (isDangerousWeight) {
        bypassedHazards.push("Weight restricted bridge warning bypassed: 10-Ton limit county zone excluded.");
        routingSafetyCode = "RESTRIBUTION_RE-ROUTE_COMPLETE";
      }
      if (simHazmat !== "None") {
        bypassedHazards.push(`Propane & Class 2 tunnel restriction bypassed successfully.`);
        routingSafetyCode = "HAZMAT_BYPASS_ENGAGED";
      }

      setSimResult({
        success: true,
        routeName: `Route STG-${Math.floor(2000 + Math.random() * 7000)}`,
        estimatedMiles: Math.floor(180 + Math.random() * 500),
        estimatedMinutes: Math.floor(220 + Math.random() * 900),
        avoidedBridgeHeight,
        bypassedHazards: bypassedHazards.length > 0 ? bypassedHazards : ["Clearance inspection passed. Standard highway segments allocated."],
        routingSafetyCode,
        tollSavings: isDangerousWeight ? "$45.00 Escort fee saved" : "$0.00 standard rate toll"
      });
    }, 1201);
  };

  // Simulated Load board lock in click
  const handleSimulatedLoadBooking = (loadId: string) => {
    setIsBookingProcess(true);
    setTimeout(() => {
      setIsBookingProcess(false);
      setBookedLoadId(loadId);
    }, 1000);
  };

  const formatEldMinutes = (totMinutes: number) => {
    const hrs = Math.floor(totMinutes / 60);
    const mins = totMinutes % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col justify-between bg-[#0A0D18] text-slate-100 overflow-x-hidden selection:bg-blue-600/30 font-sans">
      
      {/* Structural Structured JSON data for local business and SEO ratings */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": COMPANY_DETAILS.name,
          "applicationCategory": "TransportSaaSApplication",
          "operatingSystem": "Android, iOS, Web",
          "offers": {
            "@type": "Offer",
            "price": "10.00",
            "priceCurrency": "USD",
            "eligibleRegion": "US, CA, MX"
          }
        })}
      </script>

      {/* Prominent Header Notice Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 relative z-50 border-b border-blue-500/10">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Enterprise Truck-Safe GPS, FMCSA ELD App &amp; Load Board for just <strong>$10/mo</strong> — Flat Billing, cancel in 1 click!</span>
        <button 
          onClick={() => setIsQuoteModalOpen(true)}
          className="underline ml-1 hover:text-white hover:scale-103 active:scale-95 transition-all text-sky-100 font-bold"
        >
          Start 14-Day Free Onboarding
        </button>
      </div>

      {/* Standard Persistent Nav Controls */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onRequestQuote={() => setIsQuoteModalOpen(true)} 
      />

      {/* Primary Variable UI Pages */}
      <main id="main-content-flow" className="flex-1 w-full relative z-10">
        
        {/* Glow backdrop layers */}
        <div className="absolute top-1/10 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full filter blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full filter blur-[150px] pointer-events-none -z-10" />

        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-24 pb-20"
            >
              {/* LANDING PAGE HERO ZONE */}
              <section id="hero-banner" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Text zone on the left */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5 text-sky-400" />
                      <span>SaaS Navigation Suite</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans uppercase">
                      Stop Overpaying. <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-300 bg-gradient-to-r">
                        TRUCK GPS &amp; COMPLIANCE
                      </span> <br />
                      FOR JUST $10/MO.
                    </h1>

                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-sans">
                      Turn-by-turn commercial truck navigation profiles avoiding low bridges, legal FMCSA registered logs, automated multi-jurisdictions fuel mileage logs, and a built-in direct commission-free load board. Zero setup fee, zero contracts.
                    </p>

                    {/* App capabilities metrics checklists */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-mono py-4 border-y border-slate-800/80 max-w-xl">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Low-Bridge Bypass Warnings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>100% FMCSA Mandated ELD</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Zero Brokers Load board Matching</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Automated State Fuel Audits</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <button
                        onClick={() => setIsQuoteModalOpen(true)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Start 14-Day Free Onboarding</span>
                        <ArrowRight className="w-4.5 h-4.5" />
                      </button>

                      <button
                        onClick={() => handleLinkClick("services")}
                        className="px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-95"
                      >
                        Explore App Suite
                      </button>
                    </div>

                    <div className="flex gap-8 pt-4 font-mono text-[10px] uppercase text-slate-550 font-bold">
                      <p>⭐ 4.9 App Store Average</p>
                      <p>🚛 15k+ Verified Operators</p>
                    </div>
                  </div>

                  {/* Visual mockup frames on the right */}
                  <div className="lg:col-span-5 relative">
                    <motion.div 
                      className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950/90 p-3 transform-gpu"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-25 flex items-center justify-center border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>

                      <div className="rounded-2xl overflow-hidden border border-slate-900 bg-slate-900/30 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none z-10" />

                        {/* Interactive dynamic map simulation inside phone device frame */}
                        <div className="h-[380px] bg-slate-950 relative overflow-hidden flex flex-col justify-between p-4">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                            <pattern id="gridMain" width="24" height="24" patternUnits="userSpaceOnUse">
                              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#101B2E" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#gridMain)" />

                            {/* Simulated highway path track */}
                            <path 
                              d="M 50 320 Q 200 120 350 40" 
                              fill="none" 
                              stroke="#3b82f6" 
                              strokeWidth="4" 
                              strokeLinecap="round" 
                            />
                            {/* Running pulses */}
                            <circle cx={50 + (3 * animationOffset)} cy={320 - (2.8 * animationOffset)} r="5" fill="#60a5fa" />
                            <circle cx="170" cy="165" r="12" fill="#ef4444" fillOpacity="0.1" />
                            <circle cx="170" cy="165" r="4" fill="#ef4444" />
                          </svg>

                          <div className="relative z-10 flex items-center justify-between font-mono">
                            <div className="bg-slate-900/95 border border-slate-800 rounded-lg py-1 px-2.5 flex items-center gap-1.5 text-xs">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span className="text-emerald-400 font-bold font-mono">DISPATCH ACTIVE</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500">14-DAY TRIAL PASS</span>
                          </div>

                          <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-[#ef4444]/10 border border-[#ef4444]/40 rounded-xl p-3 max-w-[200px] text-center shadow-lg">
                              <p className="text-[9px] uppercase tracking-widest text-[#ef4444] font-bold font-mono">Clearance Bypass</p>
                              <p className="text-[11px] text-white mt-1 font-semibold leading-snug">11'6" overpass bypassed. Safety detour loaded.</p>
                            </div>
                          </div>

                          <div className="relative z-10 bg-slate-900/95 border border-slate-800 rounded-xl p-3 text-left">
                            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider font-mono">Route Guard Active</p>
                            <div className="grid grid-cols-3 gap-2 mt-1.5 text-white">
                              <div>
                                <p className="text-xs text-slate-550 font-mono uppercase">Next stop</p>
                                <p className="text-xs font-bold truncate">I-80 Plaza</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-550 font-mono uppercase">HOS Left</p>
                                <p className="text-xs font-bold text-emerald-400">02h 45m</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-550 font-mono uppercase">Compliance</p>
                                <p className="text-[9px] font-bold bg-emerald-500/10 border border-emerald-400/30 px-1 py-0.5 rounded text-emerald-400 text-center font-mono uppercase">Secure</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  </div>

                </div>
              </section>

              {/* SECTION: SAAS INTERACTIVE SIMULATOR DESK */}
              <section id="interactive-suite" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                    SaaS App Playground
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
                    Test-Drive Our Live Components
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Test our routing algorithms, interactive DOT log selectors, and direct shipload boards live before creating an account.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  
                  {/* COMPONENT 1: ROUTING CLEARANCE SIMULATOR */}
                  <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-blue-500/15 border border-blue-500/20 rounded-lg text-blue-400">
                            <Navigation className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base font-sans">Route Guard clearance Auditor</h3>
                            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Physical overpass checking</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">Connected</span>
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <label className="text-slate-400 block mb-1">Departure Location</label>
                          <input 
                            type="text" 
                            value={simOrigin}
                            onChange={(e) => setSimOrigin(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Target Destination</label>
                          <input 
                            type="text" 
                            value={simDest}
                            onChange={(e) => setSimDest(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Trailer Clearance Height</label>
                          <select 
                            value={simHeight}
                            onChange={(e) => setSimHeight(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white font-bold focus:outline-none"
                          >
                            <option value="12-6">12ft 6in - Flatbed Standard</option>
                            <option value="13-6">13ft 6in - Regular Legal Box</option>
                            <option value="14-2">14ft 2in - Oversized Load</option>
                            <option value="15-0">15ft 0in - Extreme Decking</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Hazard Class/HAZMAT</label>
                          <select 
                            value={simHazmat}
                            onChange={(e) => setSimHazmat(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white font-bold focus:outline-none"
                          >
                            <option value="None">None - Standard Dry Goods</option>
                            <option value="Class 3">Class 3 (Flammable Liquid)</option>
                            <option value="Class 2.1">Class 2.1 (Propane Payloads)</option>
                            <option value="Class 9">Class 9 (Miscellaneous)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={runSimulatedAudit}
                        disabled={isSimulatingRoute}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        {isSimulatingRoute ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>CALCULATING TRUCK ROUTING ALGORITHMS...</span>
                          </>
                        ) : (
                          <>
                            <span>Run Truck-Safe Route Check</span>
                            <Navigation className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Results of simulated parameters */}
                    <div className="mt-6 pt-5 border-t border-slate-800 text-xs font-mono space-y-3">
                      {simResult ? (
                        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/10 space-y-2.5 text-left animate-fade-in">
                          <div className="flex items-center justify-between text-slate-400 text-[9px] uppercase">
                            <span>Diagnostic Audit Code</span>
                            <span className="text-emerald-400 font-bold font-mono text-[10px]">{simResult.routingSafetyCode}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-white">
                            <div>
                              <p className="text-slate-500 text-[10px] uppercase">Allocated Route Distance</p>
                              <p className="text-sm font-bold text-slate-200">{simResult.estimatedMiles} miles ({Math.ceil(simResult.estimatedMinutes / 60)}h travel)</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-[10px] uppercase">Toll Savings Summary</p>
                              <p className="text-sm font-bold text-emerald-400">{simResult.tollSavings}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-900">
                            <p className="font-semibold text-sky-450 flex items-center gap-1 text-[11px] font-sans">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Clearance Intercept Detours Loaded:</span>
                            </p>
                            <ul className="space-y-1 text-[10px] list-disc list-inside text-slate-400 mt-1 font-sans">
                              {simResult.bypassedHazards.map((item: string, idx: number) => (
                                <li key={idx} className="leading-relaxed">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 text-center py-6 text-slate-500 font-sans text-xs">
                          <p>Define departure parameters, height class, and HAZMAT types to calculate route parameters.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* COMPONENT 2: COMMISSION FREE LOAD MATCHING BOARD */}
                  <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-sm shadow-xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                            <Network className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base">Broker-Free Dispatch Board Simulator</h3>
                            <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Shippers post directly to carriers</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Active matches</span>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-wrap gap-1.5 font-mono">
                        {["All", "Dry Van", "Reefer", "Flatbed", "Power Only"].map(filter => (
                          <button
                            key={filter}
                            onClick={() => { setSelectedLoadFilter(filter); setBookedLoadId(null); }}
                            className={`px-3 py-1 text-[10px] font-mono font-bold tracking-wider rounded uppercase transition-colors cursor-pointer ${
                              selectedLoadFilter === filter 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/35" 
                                : "bg-slate-950 text-slate-550 border border-slate-850 hover:text-white"
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>

                      {/* Display dynamic query stream */}
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {MOCK_LOADS
                          .filter(l => selectedLoadFilter === "All" || l.equipment === selectedLoadFilter)
                          .map(load => {
                            const isThisBooked = bookedLoadId === load.id;
                            return (
                              <div 
                                key={load.id} 
                                className={`p-3.5 rounded-lg border flex items-center justify-between gap-4 font-mono text-xs transition-all ${
                                  isThisBooked 
                                    ? "bg-slate-950 border-emerald-500/30 text-slate-500" 
                                    : "bg-slate-950 border-slate-850 text-white hover:border-slate-800"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-205 font-bold">{load.origin} ➔ {load.dest}</span>
                                    <span className="text-[9px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-sky-400 font-bold">{load.equipment}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 mt-1 font-sans">
                                    <span>Distance: <strong>{load.distance}</strong></span>
                                    <span className="text-emerald-400">Direct rate: <strong>{load.payout}</strong></span>
                                    <span className="text-yellow-400 font-semibold">SKIPPED COMMISSION: <strong>+${load.brokerSaved}</strong></span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleSimulatedLoadBooking(load.id)}
                                  disabled={isThisBooked || isBookingProcess}
                                  className={`px-3 py-2 rounded text-[10px] font-bold uppercase transition-transform active:scale-95 cursor-pointer flex items-center gap-1 ${
                                    isThisBooked 
                                      ? "bg-slate-900 border border-slate-800 text-slate-500" 
                                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                                  }`}
                                >
                                  {isThisBooked ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>LOCKED BOOKING</span>
                                    </>
                                  ) : (
                                    <span>Accept Rate</span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                      </div>

                    </div>

                    {/* Footer text coordinate actions */}
                    <div className="mt-5 pt-4 border-t border-slate-800">
                      {bookedLoadId ? (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-400/20 rounded-lg text-xs flex items-center gap-3 text-slate-300 animate-slide-up">
                          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="font-bold text-white uppercase text-[11px]">Direct cargo booking lock established!</p>
                            <p className="text-[10px] text-slate-350">Dial shipper support instantly to sign shipping ledger: <strong className="text-emerald-400 font-mono">(973) 932-4796</strong></p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                          <span>TRUCKER RETAINS 100% OF LINEHAUL WITHOUT INTERMEDIARY MARGINS</span>
                          <span className="text-emerald-400 font-bold">DISPATCH-SECURE</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION: VALUE HIGHLIGHT COMPARE GRIDS */}
              <section id="saas-highlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0F1322] to-[#171E36] border border-slate-805 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full filter blur-[120px] pointer-events-none" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left relative z-10">
                    <div className="space-y-6">
                      <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
                        Monthly Cost Comparison
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none font-sans">
                        Ditch Corporate Overpricing. <br />
                        Keep your payroll.
                      </h3>
                      <p className="text-slate-450 text-sm leading-relaxed">
                        Why pay Samsara or Trucker Path $60 to $120 a month with locked-in 3-year fine print? Superior Truck GPS packages ultimate commercial navigation, logs, and state fuels audits in a single app for a flat <strong>$10/mo</strong>. No sales reps, no setup fee, cancel anytime.
                      </p>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-850 shadow">
                          <span className="text-white font-bold">Superior Truck GPS Portal</span>
                          <span className="text-emerald-400 font-black text-sm">$10.00 / Mo</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-lg border border-slate-850/40 text-slate-500 line-through">
                          <span>Typical corporate competitor fleet service</span>
                          <span>$85.00 / Mo</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-lg border border-slate-850/40 text-slate-500 line-through">
                          <span>Standard navigation + logging subscription</span>
                          <span>$59.00 / Mo</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setIsQuoteModalOpen(true)}
                          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer"
                        >
                          Check Multi-Truck Fleet Pricing
                        </button>
                      </div>
                    </div>

                    {/* COMPONENT 3: INTERACTIVE BLE ELD LOG SIMULATOR */}
                    <div className="p-6 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl relative max-w-sm mx-auto w-full font-mono">
                      <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4 text-[9px]">
                        <span className="text-slate-500">FMCSA REGULATION AUDITING</span>
                        <span className="text-blue-400 font-bold uppercase animate-pulse">BLE Diagnostic Feed Verified</span>
                      </div>

                      {/* Display circular clock countdown logs */}
                      <div className="flex flex-col items-center justify-center py-4 relative">
                        <div className="relative w-36 h-36 rounded-full border-4 border-blue-900/30 flex flex-col items-center justify-center text-center">
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow" />
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">HOS Left Today</p>
                          <p className="text-2xl font-black text-white">{formatEldMinutes(hosHoursRemaining)}</p>
                          <p className="text-[9px] text-[#34d399] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-400/20 font-bold mt-1 uppercase tracking-wide font-mono">D.O.T SECURE</p>
                        </div>
                      </div>

                      <p className="text-slate-400 text-[10px] uppercase text-center mt-3 font-semibold">Change Log Duty Mode:</p>
                      <div className="grid grid-cols-4 gap-1.5 mt-2">
                        {[
                          { id: "OFF", label: "Off" },
                          { id: "ON", label: "On" },
                          { id: "SB", label: "Sleeper" },
                          { id: "DRIVE", label: "Drive" }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => {
                              setHosStatus(st.id as any);
                              if (st.id === "DRIVE") setHosHoursRemaining(11 * 60 - 18);
                              if (st.id === "OFF" || st.id === "ON") setHosHoursRemaining(14 * 60);
                              if (st.id === "SB") setHosHoursRemaining(10 * 60);
                            }}
                            className={`py-1.5 px-2 rounded text-[10px] font-bold uppercase text-center cursor-pointer transition-colors ${
                              hosStatus === st.id 
                                ? "bg-blue-600 text-white border border-blue-500" 
                                : "bg-slate-900 border border-slate-850 text-slate-500 hover:text-white"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>

                      <div className="text-[9px] mt-4 p-2.5 bg-slate-900 border border-slate-850 rounded text-slate-400 leading-relaxed text-left font-sans">
                        <p><strong>Compliance status note:</strong> Speedometer data syncing continuously. Instant data file generated for safety check. Infraction audit logs: <span className="text-emerald-400 font-bold">100% compliant</span>.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION: REASONS TO CHOOSE US */}
              <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                    SaaS Platform Advantages
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                    Trusted by Over 15,200 Operators Nationwide
                  </h2>
                  <p className="text-slate-400 leading-relaxed text-sm sm:text-base font-sans">
                    Discover why independent carriers choose Superior Truck GPS over overpriced legacy enterprise products.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {REASONS_TO_CHOOSE_US.map((reason, idx) => (
                    <div 
                      key={reason.title} 
                      className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 space-y-3 shadow-md group text-left"
                    >
                      <div className="w-10 h-10 bg-blue-550/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold font-mono group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors duration-300">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-white text-base font-bold tracking-wide">{reason.title}</h3>
                      <p className="text-slate-404 text-xs sm:text-sm leading-relaxed">{reason.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: WHY OWNER-OPERATORS RECOMMEND SUPERIOR */}
              <section id="client-opinions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                    Carrier voices
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                    Vouched for by working truck drivers
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Read the verified feedback from owner-operators who trust Superior with their safety logs and routing profiles daily.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {TESTIMONIALS_DATA.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/20 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between text-left shadow-md backdrop-blur-sm"
                    >
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed font-sans">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-bold">{item.name}</p>
                          <p className="text-slate-500 text-[10px] font-mono mt-0.5 uppercase tracking-wider">{item.role}</p>
                        </div>
                        <span className="text-[10px] uppercase bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded font-bold font-mono tracking-wider">
                          {item.company}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: PHONE VOICE DIAL TO-ACTION */}
              <section id="onboard-telephony" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 select-none">
                <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 via-indigo-950/20 to-[#0F1322] text-center relative overflow-hidden border border-blue-500/10 shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/15 rounded-full filter blur-2xl pointer-events-none" />
                  
                  <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight leading-none">
                      Ready to start mapping with confidence?
                    </h3>
                    <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
                      Download the client application instantly to kick off your 14-Day Free Pass. If you manage a fleet of 5+ vehicles or require customized routing parameters, connect with our support desk coordinates directly.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 font-mono text-xs">
                      <a
                        href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9]/g, "")}`}
                        className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg hover:scale-103 transition-transform"
                      >
                        <Phone className="w-4 h-4 text-white animate-bounce" />
                        <span>Voice Activation Desk: {COMPANY_DETAILS.phone}</span>
                      </a>
                      
                      <a
                        href={`mailto:${COMPANY_DETAILS.email}`}
                        className="px-6 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 hover:text-white rounded-xl text-sm font-semibold transition-transform"
                      >
                        <span>Support: {COMPANY_DETAILS.email}</span>
                      </a>
                    </div>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-extrabold">
                      Instant Account Configuration Completed Under 15 Minutes
                    </p>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {activePage === "about" && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 pb-20 text-left"
            >
              {/* Header Title */}
              <div className="space-y-4 max-w-3xl">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                  About Our Platform
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase font-sans">
                  Engineered for Truckers. Built for margins.
                </h1>
                <p className="text-slate-405 text-base sm:text-lg leading-relaxed font-sans">
                  Superior Truck GPS is a dedicated nationwide logistics software provider supporting independent owner-operators, commercial drivers, and fleet dispatchers across North American shipping corridors.
                </p>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Description column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-4 text-slate-400 text-sm sm:text-base leading-relaxed font-sans text-left">
                    <p>
                      Logistics operations run on demanding physical targets. Between corporate software subscription fees averaging $80/mo per truck, and brokers claiming up to 30% of freight linehaul rates, independent carriers face massive cash challenges.
                    </p>
                    <p>
                      At Superior Truck GPS, our focus is to converge professional, enterprise-grade truck-safe turn-by-turn navigation, registered FMCSA ELD compatibility, automatic jurisdictions fuel tax accounting, and direct commission-free cargo matching boards—all in a unified, high-performance portal priced affordably at just <strong>$10/mo</strong>.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
                    <h3 className="text-blue-400 text-xs font-bold tracking-wide uppercase font-mono">Our Tactical Advantages:</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-350 font-sans mt-2.5 font-semibold">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>24/7 Nationwide Server Support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>FMCSA USDOT Registered Link</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Odo Logging Diagnostics BLE support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Direct-to-Shipper Load board Sourcing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Diagnostics graphic column */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/40">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                    <img 
                      src={DELIVERY_VAN_IMAGE} 
                      alt="Superior Truck GPS diagnostics" 
                      referrerPolicy="no-referrer"
                      className="w-full h-[350px] object-cover opacity-80"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-slate-950/95 border border-slate-800 rounded-xl shadow-lg text-left">
                      <p className="text-[10px] text-blue-400 font-bold uppercase font-mono tracking-widest">Active Fleet Support</p>
                      <p className="text-slate-350 text-xs mt-1 font-sans">Active telemetry linked with 15,200+ ELD diagnostic feeds globally. Automated load board updates refreshed instantly.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Mission Card */}
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">Our Mission Statement</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed italic font-sans text-slate-305">
                      &ldquo;{COMPANY_DETAILS.mission}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">Our Vision &amp; Core Values</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed italic font-sans text-slate-305">
                      &ldquo;{COMPANY_DETAILS.vision}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activePage === "services" && (
            <motion.div
              key="services-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 pb-20 text-left"
            >
              {/* Header Title Guide */}
              <div className="space-y-4 max-w-3xl">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                  Our Feature Suite
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase font-sans">
                  All Your logistics tools inside a single login.
                </h1>
                <p className="text-slate-450 text-base sm:text-lg leading-relaxed font-sans">
                  Explore how we converge commercial GPS navigation, certified ELD compliance logs, automated tax state accounting, and free dispatch loads directly on any mobile device.
                </p>
              </div>

              {/* Dynamic Feature Grid populated directly from data.ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SERVICES_DATA.map((srv) => (
                  <div 
                    key={srv.id} 
                    className={`p-8 rounded-2xl border flex flex-col justify-between transition-all duration-300 group ${
                      srv.highlight 
                        ? "bg-gradient-to-br from-[#0F1221] to-[#151D34] text-white border-blue-500/15 shadow-xl shadow-blue-900/5" 
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-blue-505/5"
                    }`}
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className={`p-3.5 rounded-xl ${
                          srv.highlight 
                            ? "bg-blue-600/25 text-blue-400 border border-blue-500/30" 
                            : "bg-slate-950 border border-slate-800 text-sky-450"
                        }`}>
                          {renderServiceIcon(srv.iconName, "w-6 h-6")}
                        </div>
                        {srv.highlight && (
                          <span className="text-[9px] font-mono uppercase bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 px-2.5 py-1 rounded-full font-bold tracking-widest font-mono">
                            HIGH CONVERTING
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className={`text-xl font-bold tracking-wide ${srv.highlight ? "text-white" : "text-white"}`}>{srv.title}</h3>
                        <p className={`text-sm leading-relaxed ${srv.highlight ? "text-slate-300" : "text-slate-400"}`}>{srv.longDescription}</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className={`text-[10px] font-bold uppercase tracking-wider font-mono ${srv.highlight ? "text-slate-450" : "text-slate-500"}`}>Key Capabilities Included:</p>
                        <ul className="space-y-1.5 font-sans">
                          {srv.benefits.map((ben) => (
                            <li key={ben} className={`flex items-start gap-2 text-xs ${srv.highlight ? "text-slate-300" : "text-slate-400"}`}>
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{ben}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className={`pt-8 mt-6 flex items-center justify-between gap-4 border-t ${srv.highlight ? "border-slate-805" : "border-slate-850"}`}>
                      <div className="flex flex-col gap-0.5 font-mono text-xs">
                        <span className={`uppercase text-[9px] font-bold ${srv.highlight ? "text-slate-500" : "text-slate-500"}`}>Billing Standard</span>
                        <span className="font-extrabold text-emerald-400">$10/Mo Flat Rate</span>
                      </div>
                      
                      <button
                        onClick={() => setIsQuoteModalOpen(true)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 uppercase tracking-wide duration-350 ${
                          srv.highlight 
                            ? "bg-blue-600 hover:bg-blue-500 text-white" 
                            : "bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-slate-300"
                        }`}
                      >
                        <span>Test Trial</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div id="faq-section" className="max-w-4xl mx-auto w-full pt-10">
                <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">Frequently Asked Questions</h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans">Find answers regarding compliant ELDs, truck routes, and platform billing rules.</p>
                </div>

                <div className="space-y-3.5">
                  {FAQS_DATA.map((faq) => {
                    const isFaqActive = activeFaqId === faq.id;
                    return (
                      <div 
                        key={faq.id} 
                        className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 backdrop-blur-sm shadow-md"
                      >
                        <button
                          onClick={() => setActiveFaqId(isFaqActive ? null : faq.id)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-white hover:bg-slate-900/50 transition-colors cursor-pointer font-sans"
                        >
                          <span>{faq.question}</span>
                          <ChevronRight className={`w-4 h-4 text-blue-400 transform transition-transform duration-200 ${isFaqActive ? "rotate-90" : ""}`} />
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isFaqActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <div className="p-5 pt-0 text-xs sm:text-sm text-slate-404 leading-relaxed border-t border-slate-800/60 bg-slate-950/20 font-sans">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {activePage === "contact" && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-20 text-left"
            >
              {/* Header Title */}
              <div className="space-y-4 max-w-3xl">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
                  Customer Assistance
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase font-sans">
                  Connect with our Driver Support Hub
                </h1>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
                  Have an onboarding issue, licensing inquiry, or custom fleet volume quote? Contact our US server network or shoot us a quick support ticket.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Column 1: Contact details & customized locator graphic map */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Info card containing details */}
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-white text-base font-bold tracking-wide uppercase font-mono border-b border-slate-800 pb-2">Central Operations Desk</h3>
                    
                    <div className="space-y-4 text-xs sm:text-sm text-slate-350 font-sans">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wide text-xs">Licensing Center:</p>
                          <p className="text-slate-400 text-xs mt-0.5 font-semibold">Dallas Central Terminal (Nationwide Routing)</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wide text-xs">Live Support line:</p>
                          <a href={`tel:${COMPANY_DETAILS.phone.replace(/[^0-9]/g, "")}`} className="text-blue-400 hover:text-blue-300 hover:underline font-mono font-extrabold mt-0.5 block text-lg">
                            {COMPANY_DETAILS.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wide text-xs">Technical Support Email:</p>
                          <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-blue-400 hover:text-blue-300 hover:underline mt-0.5 block truncate font-mono">
                            {COMPANY_DETAILS.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-404 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white uppercase tracking-wide text-xs">Service Corridor Coverage:</p>
                          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed font-sans font-semibold">
                            {COMPANY_DETAILS.serviceArea}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elegant styled mock radar locator */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-3">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                        Nationwide radar coordinates
                      </span>
                      <span className="text-[10px] text-slate-500">CORRIDOR STATUS: SECURE</span>
                    </div>

                    {/* Styled canvas mock */}
                    <div className="h-[210px] rounded-xl bg-slate-950 border border-slate-850 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 select-none font-mono">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1626_1px,transparent_1px),linear-gradient(to_bottom,#0f1626_1px,transparent_1px)] bg-[size:20px_20px] opacity-70" />
                      <div className="w-24 h-24 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center animate-ping absolute" />
                      <div className="w-14 h-14 rounded-full border border-sky-400/30 bg-sky-400/10 flex items-center justify-center relative z-10">
                        <MapPin className="w-6 h-6 text-sky-400" />
                      </div>

                      <div className="relative z-10 mt-3 space-y-1">
                        <p className="text-xs font-bold text-white uppercase tracking-wide">Central Server Node</p>
                        <p className="text-[10px] text-slate-550 max-w-xs leading-normal font-sans">
                          Active telemetry linked with 15k+ ELD diagnostic feeds globally. Automated load board updates refreshed instantly.
                        </p>
                      </div>

                      <div className="absolute bottom-2 right-2 z-10 text-[8px] uppercase tracking-wider bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold text-slate-400">
                        99.98% Server Uptime
                      </div>
                    </div>
                  </div>

                </div>

                {/* Column 2: Lead gen form for direct licensing requests */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6 md:p-8 text-left">
                  <h3 className="text-lg font-bold text-white tracking-wide border-b border-slate-800 pb-3 mb-6 uppercase font-mono">Submit Custom SaaS Request</h3>
                  
                  {!contactResponse ? (
                    <form onSubmit={handleContactSubmit} className="space-y-4 font-sans text-slate-350">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Your Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="John Carter"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-colors placeholder:text-slate-650 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Email address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="john@cartertrans.com"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-colors placeholder:text-slate-650 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Driver Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="(973) 932-4796"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-colors placeholder:text-slate-655 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Fleet Cargo / Company Name
                          </label>
                          <input
                            type="text"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            placeholder="Carter Transportation LLC"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-colors placeholder:text-slate-655 font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                          Product Interest
                        </label>
                        <select
                          value={contactForm.serviceType}
                          onChange={(e) => setContactForm({ ...contactForm, serviceType: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-colors font-bold"
                        >
                          <option value="Single Truck 14-Day Free Trial ($10/mo)">Single Truck 14-Day Free Trial ($10/mo)</option>
                          <option value="Small Carrier Fleet Account (2-10 Units)">Small Carrier Fleet Account (2-10 Units)</option>
                          <option value="Commercial Fleet Enterprise License (10+ Units)">Commercial Fleet Enterprise License (10+ Units)</option>
                          <option value="Truck-Safe Navigation &amp; GPS Only">Truck-Safe Navigation &amp; GPS Only</option>
                          <option value="FMCSA Registered ELD Compliance Software">FMCSA Registered ELD Compliance Software</option>
                          <option value="Commission-Free Direct Load Board Trial">Commission-Free Direct Load Board Trial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 font-sans">
                          Let us know your general requirements, active fleet size, or technical queries <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Please let us know how many active trucks you coordinate, and if you require certified OBD-II hardware dongles for ELD logs tracking..."
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-900 transition-colors placeholder:text-slate-650"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isContactSubmitting}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                      >
                        {isContactSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>TRANSITING ACCOUNT DETAILS...</span>
                          </>
                        ) : (
                          <>
                            <span>Register 14-Day Free Pass</span>
                            <ArrowRight className="w-4.5 h-4.5" />
                          </>
                        )}
                      </button>

                    </form>
                  ) : (
                    /* Success messaging */
                    <div className="text-center py-8 space-y-6">
                      <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-white tracking-wide uppercase font-mono">SaaS Trial Registration Completed</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                          {contactForm.name}, your credentials have been verified. An onboarding manager has reserved a commercial license for your active unit.
                        </p>
                      </div>
                      
                      {contactResponse.reference && (
                        <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl max-w-xs mx-auto text-center">
                          <p className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold">licence reference ID:</p>
                          <p className="text-sm text-blue-400 font-mono font-bold mt-1 tracking-wider">{contactResponse.reference}</p>
                        </div>
                      )}

                      <button
                        onClick={() => setContactResponse(null)}
                        className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:text-white text-slate-400 text-xs font-bold rounded-lg transition-colors cursor-pointer font-mono"
                      >
                        Submit Another Profile
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Floating AI active assistant widget */}
      <Chatbot />

      {/* Persistent scroll utility */}
      <ScrollToTop />

      {/* Overlaid onboarding trial modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />

      {/* Custom styled professional footer */}
      <Footer 
        setActivePage={setActivePage} 
        onRequestQuote={() => setIsQuoteModalOpen(true)} 
      />

    </div>
  );
}
