import { ServiceItem, TestimonialItem, FAQItem } from "./types";

export const COMPANY_DETAILS = {
  name: "Superior Truck GPS",
  shortName: "Superior GPS",
  location: "United States (Nationwide Service)",
  address: "Nationwide Commercial Fleet Support",
  phone: "(973) 932-4796",
  email: "support@superiortruckgps.org",
  serviceArea: "All 50 US States, Canada, and Mexico cross-border cargo corridors.",
  description: "Superior Truck GPS is the ultimate all-in-one platform for commercial truck drivers: providing truck-safe routing, ELD compliance, quick automated IFTA tracking, and a broker-free load board—all for just $10/month with zero contracts.",
  establishedYear: 2021,
  mission: "To empower owner-operators and small commercial fleets with enterprise-grade navigation, logging, and load procurement technology at an ultra-affordable price, protecting their bottom lines.",
  vision: "To build a transparent, broker-free logistics ecosystem where commercial truck drivers operate safely and keep 100% of their revenue.",
  pricing: {
    monthly: "$10/mo",
    setup: "$0 Setup",
    trial: "14-Day Free Trial",
    features: [
      "Commercial Truck-Safe GPS Routing",
      "FMCSA Registered ELD Logbook",
      "Automated IFTA Mileage Reports",
      "Commission-Free Direct Load Board",
      "Live Dispatcher Fleet Hub Tools"
    ]
  }
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "truck-routing",
    title: "Truck-Safe Navigation & GPS",
    shortDescription: "Voice-guided turn-by-turn commercial GPS based on your exact truck dimensions, weight, and HAZMAT category.",
    longDescription: "Avoid low bridges, restrictive parkways, and weight-limited bridges. Input your height, width, length, chemical HAZMAT classes, and total weight (Class 1-8). Superior Truck GPS calculates the optimal safe highway route and gives verbal warnings for imminent clearances.",
    benefits: [
      "Custom Class 1-8 truck-profile routing parameters",
      "Real-time visual and audio low clearance alerts ($0 bridges saved)",
      "Avoid weight-restricted bridges, narrow roads, and residential zones",
      "Offline maps support for remote cargo corridors and dead zones"
    ],
    iconName: "Compass",
    highlight: true
  },
  {
    id: "eld-compliance",
    title: "ELD compliance (HOS Logbook)",
    shortDescription: "Registered, FMCSA-certified electronic logs keeping Hours of Service, DVIR, and 1-tap roadside audits.",
    longDescription: "Ensure full compliance with USDOT regulations. This app links with standard OBD hardware modules to record driving, sleep, off-duty, and on-duty work statuses. Transmit secure CSV logs directly to inspection officials over the air with zero paperwork friction.",
    benefits: [
      "100% FMCSA certification standard (USDOT registered)",
      "Driver Vehicle Inspection Reports (DVIR) inside the mobile interface",
      "Automated remaining hours tracker with active buzzer warnings",
      "Co-driver support and instant duty-status updates"
    ],
    iconName: "ShieldCheck"
  },
  {
    id: "broker-free-loadboard",
    title: "Broker-Free Load Board",
    shortDescription: "Find profitable freight listed directly by shippers. Skip high broker commissions and earn 100% of your rate.",
    longDescription: "Avoid paying 15% to 30% of your payout to traditional middlemen. Our broker-free board matches truckers directly with commercial shippers. Tap to contact the shipping manager, submit your bid, book the schedule, and keep 100% of the listed rate.",
    benefits: [
      "Direct shipper-to-carrier match platform (0% load commission)",
      "Instant secure bookings with complete lane rate transparency",
      "Filter by location, radius, flatbed, reefer, dry-van cargo types",
      "Digital invoices with optional instant factoring payouts"
    ],
    iconName: "Network",
    highlight: true
  },
  {
    id: "ifta-calculator",
    title: "IFTA Fuel Tax Tracker",
    shortDescription: "Convert fuel tax filing into a single click with automated mileages per state and fuel receipt scans.",
    longDescription: "Save hours of exhausting cross-referencing mileage logs. Superior Truck GPS matches your vehicle's odometer readings and geo-state border crossings automatically to build jurisdiction-by-jurisdiction reports. Simply upload gas fuel receipts to autocalculate taxes.",
    benefits: [
      "Automatic state line border crossing mileage logs",
      "Smart OCR mobile gas receipts scan and cloud secure repository",
      "1-tap exportable IFTA quarterly worksheets ready for IRS state audits",
      "Reduces manual tax filing paperwork by 95%"
    ],
    iconName: "CalendarRange"
  },
  {
    id: "dispatch-fleet-management",
    title: "Live Dispatcher Fleet Hub",
    shortDescription: "Manage multiple trucks, assign loads, trace active delivery ETAs, and chat with drivers.",
    longDescription: "Excellent for multi-vehicle owner-operators or dedicated dispatch desks. Track your whole fleet's geographic locations, active paths, ELD hours leftover, and current payloads from a single glass desktop monitor. Seamlessly dispatch new load tickets directly.",
    benefits: [
      "Real-time geographical tracking on a unified dispatch dashboard",
      "Dynamic load assignment with instant push updates to drivers",
      "Accurate active arrival ETA calculations and route history log",
      "Built-in dispatcher to driver instant messenger"
    ],
    iconName: "Truck"
  },
  {
    id: "trial-pricing",
    title: "$10/mo Pricing & Free Trial",
    shortDescription: "Full access to our commercial suite with absolutely no setup fees, contracts, or cancellation fine print.",
    longDescription: "Get premium commercial routing, FMCSA ELD, automated state tax logs, and real-time loads for less than the price of a freeway coffee. Test drive the platform free for 14 days with full access benefits before deciding to subscribe.",
    benefits: [
      "Just $10/month per active vehicle — lowest industry rate",
      "Absolutely no multi-year lock-in contracts — cancel anytime",
      "14-Day Free Trial (No credit card or commitment required)",
      "24/7 technical chat support and dedicated phone support Desk"
    ],
    iconName: "Timer",
    highlight: true
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "t1",
    name: "Dave Jenkins",
    role: "Owner Operator (Flatbed)",
    company: "Dave J. Heavy Hauling LLC",
    quote: "Switching to Superior Truck GPS saved me $80/mo compared to my previous ELD and GPS subscription. The truck-safe routing bypassed three low bridges in Chicago on day one. For $10/mo with no contracts, choosing other apps is just throwing money away.",
    rating: 5
  },
  {
    id: "t2",
    name: "Maria Santos",
    role: "Fleet Logistics Dispatcher",
    company: "Apex Transco Inc (12 Units)",
    quote: "Their broker-free load board is absolute gold. We've booked dozens of recurring loads directly with local NJ and PA manufacturers and kept every dollar. Our drivers love the clean navigation interface, and I can track their exact positions in real-time.",
    rating: 5
  },
  {
    id: "t3",
    name: "Tyrone Washington",
    role: "Interstate Driver",
    company: "T-Wash Freight Operations",
    quote: "Quarterly IFTA calculations used to take me hours of painful logs lookups. Superior Truck GPS calculates everything behind the scenes by state lines. Road audits are a breeze since I can just show the DOT inspector my FMCSA-registered logs on my phone.",
    rating: 5
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: "faq1",
    question: "How does the $10/mo subscription work? Are there any hidden contracts?",
    answer: "There are absolutely no contracts, activation fees, cancellation fees, or hidden markups. You pay exactly $10 per month per active truck. You are billed monthly and can cancel, downgrade, or suspend your account anytime with a single click inside the app or profile."
  },
  {
    id: "faq2",
    question: "What hardware do I need for the ELD (Electronic Logging Device) compliance?",
    answer: "Our mobile application connects wirelessly via Bluetooth to standard low-cost Jbus OBD diagnostic dongles inside your cabin. Superior Truck GPS is fully certified and registered with the FMCSA. You can purchase our compatible hardware link or use your existing registered ELD hardware!"
  },
  {
    id: "faq3",
    question: "Is the commercial GPS routing really specific to trucks?",
    answer: "Yes, 100%! Unlike consumer navigation apps (like Google Maps or Apple Maps) which send you down residential side-streets or restricted parkways, Superior Truck GPS evaluates low clearance bridge overpasses (e.g. 11'6\"), strict weigh stations, axle-related state limits, and narrow lanes to compute legal, truck-approved routes."
  },
  {
    id: "faq4",
    question: "How do I access the broker-free load board?",
    answer: "Our broker-free load board is built-in directly to the app. As soon as you log in (whether on free trial or premium), you can look up commercial loads based on origin, destination, payout, and trailer type (Dry Van, Reefer, Flatbed, Hotshot). You negotiate directly with shippers, bypass traditional brokers, and pay 0% commissions!"
  },
  {
    id: "faq5",
    question: "Can I try the app for free?",
    answer: "Yes, we offer a 14-Day Free Trial. No contracts, credit card, or commitment is required. Simply download the app, make a driver or dispatcher profile, set up your truck dimensions, and start running routes immediately. We'll alert you before your free trial runs out."
  }
];

export const REASONS_TO_CHOOSE_US = [
  {
    title: "Lowest Industry Pricing",
    description: "Get full commercial premium tools—GPS, FMCSA ELD compatibility, automatic IFTA mapping, and direct live loads—for only $10/mo instead of the standard $60-$120 charged by corporate giants."
  },
  {
    title: "Truck-Safe Navigation",
    description: "Our intelligence engine parses bridge heights, weight limits, HAZMAT allowances, and weigh scales so you don't risk expensive traffic citations, structural collisions, or truck damage."
  },
  {
    title: "Direct Shipper Freight",
    description: "Connect on the broker-free load board with verified, vetted shippers who need regional or nationwide carrier haulage, protecting your operational margins."
  },
  {
    title: "Zero Commitment",
    description: "We are built for working truck drivers. We do not require long contract periods or pushy sales reps. If you park your truck for a season, you can cancel or pause immediately without penalties."
  }
];

export const SEO_KEYWORDS = {
  mainTitle: "Superior Truck GPS | All-In-One Truck Routing, ELD & Broker-Free Load Board",
  metaDescription: "Professional commercial truck GPS navigation app with FMCSA-registered ELD logbooks, quarterly automated IFTA tax logs, and commission-free shipper loads for just $10/mo with no contracts. Start your free trial today!",
  focusedKeywords: [
    "Truck safe GPS and routing",
    "FMCSA certified ELD logbook app",
    "Quarterly IFTA calculator and mileage logs",
    "Broker-free load board",
    "Commercial fleet dispatching solutions"
  ]
};
