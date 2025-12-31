
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(value);
  const targetValueRef = useRef(value);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== targetValueRef.current) {
      startValueRef.current = displayValue;
      targetValueRef.current = value;
      startTimeRef.current = null;
      
      const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const progress = Math.min((time - startTimeRef.current) / duration, 1);
        
        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(
          startValueRef.current + (targetValueRef.current - startValueRef.current) * easedProgress
        );
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };
      
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value, duration, displayValue]);

  return <>{displayValue.toLocaleString()}</>;
};

export default AnimatedNumber;
