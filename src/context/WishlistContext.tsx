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

const STORAGE_KEY = "jersey-house.wishlist.v1";

interface WishlistContextValue {
  ids: string[];
  count: number;
  isHydrated: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIds(readStoredIds());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* storage unavailable — wishlist stays in memory */
    }
  }, [ids, isHydrated]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    setIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const remove = useCallback((id: string) => {
    setIds((current) => current.filter((item) => item !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, isHydrated, has, toggle, remove, clear }),
    [ids, isHydrated, has, toggle, remove, clear],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}
