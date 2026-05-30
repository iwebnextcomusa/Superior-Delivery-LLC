import React, { useState } from "react";
import { QuoteFormData, QuoteFormResponse } from "../types";
import { X, Check, ArrowRight, Loader2, Award, Calendar, Shield, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS = [
  "Single Truck 14-Day Free Trial ($10/mo)",
  "Small Carrier Fleet Account (2-10 Units)",
  "Commercial Fleet Enterprise License (10+ Units)",
  "Truck-Safe Navigation & GPS Only",
  "FMCSA Registered ELD Compliance Software",
  "Commission-Free Direct Load Board Trial",
  "Partner Integration & Customized API"
];

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "Single Truck 14-Day Free Trial ($10/mo)",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QuoteFormResponse | null>(null);
  const [errors, setErrors] = useState<Partial<QuoteFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<QuoteFormData> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please specify a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message details or fleet details are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof QuoteFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setResponse({
          success: true,
          message: data.message,
          reference: data.reference
        });
        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          serviceType: "Single Truck 14-Day Free Trial ($10/mo)",
          message: ""
        });
      } else {
        setResponse({
          success: false,
          error: data.error || "An error occurred during submission."
        });
      }
    } catch (err) {
      setResponse({
        success: false,
        error: "Our dispatch network is currently busy. Please call our helpline at (973) 932-4796 for immediate manual activation!"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="quote-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop Blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : handleReset}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-800 z-10 select-none"
          >
            {/* Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2">
                  <span>Start Your 14-Day Trial</span>
                  <span className="text-xs uppercase bg-blue-100 border border-blue-200 text-blue-600 px-2 py-0.5 rounded font-mono font-bold tracking-widest">
                    FREE TRIAL
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Superior Truck GPS • Nationwide Commercial Licensing Desk
                </p>
              </div>
              <button
                id="modal-close-btn"
                onClick={handleReset}
                disabled={loading}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scroll Content */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {!response ? (
                <form id="quote-request-form" onSubmit={handleSubmit} className="space-y-4 font-sans">
                  
                  {/* Two column name & email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full bg-slate-50 border text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-650 focus:bg-white transition-colors ${
                          errors.name ? "border-red-500" : "border-slate-200"
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="driver@fleetmail.com"
                        className={`w-full bg-slate-50 border text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-650 focus:bg-white transition-colors ${
                          errors.email ? "border-red-500" : "border-slate-200"
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Two column phone & company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(973) 932-4796"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-650 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Truck Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Independent Owner Operator"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-650 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Select Service Type */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Required Account Type / License Class
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-650 focus:bg-white transition-colors"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white text-slate-900 font-semibold">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Details */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                      Let us know about your truck type, fleet size, or special requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Specify your truck length/height, if you require FMCSA-certified ELD hardware dongles, or if you manage a fleet of multiple units..."
                      className={`w-full bg-slate-50 border text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-650 focus:bg-white transition-colors ${
                        errors.message ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {/* Badges checklist */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[10px] uppercase font-mono font-black text-slate-500 text-center">
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>No Credit Card</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Zero Contracts</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>FMCSA Registered</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span>Just $10/mo</span>
                    </div>
                  </div>

                  {/* Form Submission Button */}
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Provisioning Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Activate 14-Day Free Trial</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Post Submission Confirmation Screen */
                <div id="quote-success-panel" className="text-center py-6 space-y-6">
                  {response.success ? (
                    <>
                      <div className="mx-auto w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center">
                        <Check className="w-7 h-7" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">SaaS Account Registered</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          We have registered your details in our secure database. Your unique commercial navigation license has been allocated and is ready to load.
                        </p>
                      </div>

                      {/* Cool ticket design */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-sm mx-auto divide-y divide-slate-200">
                        <div className="pb-3 text-left space-y-1">
                          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">App Licensing Ticket</p>
                          <p className="text-sm text-blue-600 font-mono font-bold tracking-wider">{response.reference}</p>
                        </div>
                        <div className="py-3 text-left space-y-2">
                          <p className="text-xs text-slate-500 flex items-center justify-between">
                            <span>Status:</span>
                            <span className="text-emerald-600 font-bold uppercase font-mono text-[10px]">Ready to Onboard</span>
                          </p>
                          <p className="text-xs text-slate-500 flex items-center justify-between">
                            <span>License:</span>
                            <span className="font-semibold text-slate-800">Commercial Navigation App</span>
                          </p>
                          <p className="text-xs text-slate-500 flex items-center justify-between">
                            <span>Activation:</span>
                            <span className="font-semibold text-blue-600">Active (14-Day Free Pass)</span>
                          </p>
                        </div>
                        <div className="pt-3 text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1.5 font-sans">
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          <span>Need support? Call (973) 932-4796</span>
                        </div>
                      </div>

                      {/* Visual Timeline of booking process */}
                      <div className="pt-4 max-w-md mx-auto">
                        <div className="relative flex items-center justify-between">
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
                          <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 z-0" />
                          
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">1</div>
                            <span className="text-[9px] font-mono font-bold uppercase text-blue-600 mt-1">Submitted</span>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center animate-pulse">
                            <div className="w-7 h-7 bg-blue-105 text-blue-700 border border-blue-300 rounded-full flex items-center justify-center text-xs font-bold shadow-sm bg-blue-50">2</div>
                            <span className="text-[9px] font-mono font-bold uppercase text-blue-600 mt-1">Provisioning</span>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-7 h-7 bg-slate-100 text-slate-500 border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">3</div>
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 mt-1">Link OBD Link</span>
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-7 h-7 bg-slate-100 text-slate-500 border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">4</div>
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 mt-1">Navigate Approved</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={handleReset}
                          className="px-5 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Return to Home
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto w-14 h-14 bg-red-100 border border-red-300 text-red-600 rounded-full flex items-center justify-center">
                        <X className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-red-700 tracking-tight">Onboarding Failed</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          {response.error}
                        </p>
                      </div>
                      <div className="pt-4">
                        <button
                          onClick={() => setResponse(null)}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                        >
                          Try Again
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
