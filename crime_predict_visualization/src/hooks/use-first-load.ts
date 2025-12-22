
import { useState, useEffect } from 'react';

export function useFirstLoad() {
  const [isFirstLoad] = useState(() => {
    const hasLoadedBefore = sessionStorage.getItem('csail_loaded');
    return !hasLoadedBefore;
  });

  useEffect(() => {
    if (isFirstLoad) {
      sessionStorage.setItem('csail_loaded', 'true');
    }
  }, [isFirstLoad]);

  return isFirstLoad;
}
