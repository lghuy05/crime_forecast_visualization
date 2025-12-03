// hooks/use-first-load.ts
"use client";

import { useState, useEffect } from 'react';

export function useFirstLoad() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check sessionStorage for previous load
    const hasLoadedBefore = sessionStorage.getItem('csail_loaded');

    if (hasLoadedBefore) {
      setIsFirstLoad(false);
    } else {
      // Mark as loaded after a short delay
      setTimeout(() => {
        sessionStorage.setItem('csail_loaded', 'true');
      }, 100);
    }
  }, []);

  return isFirstLoad;
}
