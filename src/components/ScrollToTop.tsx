import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div id="scroll-to-top-panel" className="fixed bottom-6 left-6 z-40 select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.10 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="p-3 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 rounded-full shadow-lg cursor-pointer transition-colors"
            title="Scroll back to top"
            aria-label="Scroll back to top of page"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
