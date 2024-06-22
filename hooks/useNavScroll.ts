import { useState, useEffect } from 'react';

const useNavScroll = (threshold: number): boolean => {
  const [aboveThreshold, setAboveThreshold] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      if (position > threshold) {
        setAboveThreshold(true);
      } else {
        setAboveThreshold(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return aboveThreshold;
};

export default useNavScroll;
