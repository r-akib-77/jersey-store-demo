"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useUI } from "@/context/UIContext";

export default function Toast() {
  const { toast } = useUI();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[95] flex justify-center px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-ink">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
