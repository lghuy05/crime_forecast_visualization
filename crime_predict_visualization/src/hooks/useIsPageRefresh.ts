import { useState, useEffect } from 'react';

// Custom hook to detect page refresh (simplified)
export const useIsPageRefresh = () => {
  const [isRefresh] = useState(() => {
    const hasLoaded = sessionStorage.getItem('homePageLoaded');
    return !hasLoaded;
  });

  useEffect(() => {
    if (isRefresh) {
      sessionStorage.setItem('homePageLoaded', 'true');
    }
  }, [isRefresh]);

  return isRefresh;
};
