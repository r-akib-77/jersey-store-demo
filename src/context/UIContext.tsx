"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types";

interface UIContextValue {
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const openQuickView = useCallback((product: Product) => setQuickViewProduct(product), []);
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const hasOverlay = Boolean(quickViewProduct) || isSearchOpen;
    document.body.style.overflow = hasOverlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [quickViewProduct, isSearchOpen]);

  const value = useMemo<UIContextValue>(
    () => ({
      quickViewProduct,
      openQuickView,
      closeQuickView,
      isSearchOpen,
      openSearch,
      closeSearch,
      toast,
      showToast,
    }),
    [quickViewProduct, openQuickView, closeQuickView, isSearchOpen, openSearch, closeSearch, toast, showToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used inside <UIProvider>");
  return context;
}
