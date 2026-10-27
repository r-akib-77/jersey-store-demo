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

interface UIStateValue {
  quickViewProduct: Product | null;
  isSearchOpen: boolean;
  toast: string | null;
}

interface UIActionsValue {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  showToast: (message: string) => void;
}

export type UIContextValue = UIStateValue & UIActionsValue;

const UIStateContext = createContext<UIStateValue | null>(null);
const UIActionsContext = createContext<UIActionsValue | null>(null);

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

  const stateValue = useMemo<UIStateValue>(
    () => ({ quickViewProduct, isSearchOpen, toast }),
    [quickViewProduct, isSearchOpen, toast],
  );

  const actionsValue = useMemo<UIActionsValue>(
    () => ({
      openQuickView,
      closeQuickView,
      openSearch,
      closeSearch,
      showToast,
    }),
    [openQuickView, closeQuickView, openSearch, closeSearch, showToast],
  );

  return (
    <UIActionsContext.Provider value={actionsValue}>
      <UIStateContext.Provider value={stateValue}>{children}</UIStateContext.Provider>
    </UIActionsContext.Provider>
  );
}

/**
 * Stable UI helpers only (never change identity).
 * Use this in components rendered inside long lists (product cards) so opening an
 * overlay does not re-render the whole list.
 */
export function useUIActions(): UIActionsValue {
  const context = useContext(UIActionsContext);
  if (!context) throw new Error("useUIActions must be used inside <UIProvider>");
  return context;
}

/** Full UI state + helpers. Re-renders whenever an overlay state changes (modals, toasts). */
export function useUI(): UIContextValue {
  const state = useContext(UIStateContext);
  const actions = useContext(UIActionsContext);
  if (!state || !actions) throw new Error("useUI must be used inside <UIProvider>");
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}
