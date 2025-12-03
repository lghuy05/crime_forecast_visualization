import React from 'react';
import { motion } from 'framer-motion';
import { GooeyText } from '../components/ui/gooey-text-morphing';

export const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <GooeyText
        texts={["Welcome", "to", "CSAIL"]}
        morphTime={1.2}
        cooldownTime={0.6}
        className="font-bold"
      />
    </motion.div>
  );
};