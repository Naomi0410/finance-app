import { useState, useEffect } from 'react';

type WindowDimensions = {
  s_width: number;
  s_height: number;
};

const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    s_width: 0,
    s_height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        s_width: window.innerWidth,
        s_height: window.innerHeight,
      });
    };

    handleResize(); // Set initial values

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
