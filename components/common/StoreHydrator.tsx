"use client";

import { useEffect } from "react";
import { store } from "@/lib/data/store";

/**
 * Loads persisted client state (localStorage) and kicks off the server refresh
 * only once React has finished hydrating.
 *
 * The store used to do this at module-import time, which meant the first client
 * render could disagree with the server-rendered HTML and tear the whole tree
 * down (React hydration errors #418/#423/#425). Running it from a mount effect
 * keeps the hydration render byte-identical to SSR.
 */
export const StoreHydrator = () => {
  useEffect(() => {
    store.hydrateFromClient();
  }, []);

  return null;
};
