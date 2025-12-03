import { useState, useEffect } from 'react';

// Custom hook to detect page refresh (simplified)
export const useIsPageRefresh = () => {
  const [isRefresh, setIsRefresh] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('homePageLoaded');

    if (hasLoaded) {
      setIsRefresh(false);
    } else {
      // Use a short timeout to ensure this runs after the initial render cycle
      setTimeout(() => sessionStorage.setItem('homePageLoaded', 'true'), 100);
    }
  }, []);

  return isRefresh;
};