import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getCurrencySymbol } from '../utils';

type FormatType = 'integer' | 'currency' | 'percentage' | 'decimal';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: FormatType;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
  smallDecimals?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1200,
  format = 'integer',
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
  smallDecimals = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  const targetValueRef = useRef<number>(value);

  // Smooth easing function - easeOutExpo for fast start, slow end
  const easeOutExpo = (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const animate = useCallback((timestamp: number) => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);

    const currentValue = startValueRef.current +
      (targetValueRef.current - startValueRef.current) * easedProgress;

    setDisplayValue(currentValue);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Ensure we end exactly on the target value
      setDisplayValue(targetValueRef.current);
      animationRef.current = null;
    }
  }, [duration]);

  const startAnimation = useCallback((from: number, to: number) => {
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = 0;
    startValueRef.current = from;
    targetValueRef.current = to;

    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Initial mount animation triggered by IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted && value !== 0) {
            setHasStarted(true);
            // Start counting from 0 after delay
            setTimeout(() => {
              startAnimation(0, value);
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, delay, hasStarted, startAnimation]);

  // Animate when value changes after initial animation
  useEffect(() => {
    if (hasStarted) {
      targetValueRef.current = value;
      // Animate from current display value to new value
      if (Math.abs(value - displayValue) > 0.5) {
        startAnimation(displayValue, value);
      }
    }
  }, [value, hasStarted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Format the display value
  const formatValue = (val: number) => {
    const absValue = Math.abs(val);
    const sign = val < 0 ? '-' : '';

    switch (format) {
      case 'currency': {
        const formatted = new Intl.NumberFormat('tr-TR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(absValue);
        const parts = formatted.split(',');
        return {
          integerPart: sign + parts[0],
          decimalPart: parts[1] ? `,${parts[1]}` : '',
          symbol: getCurrencySymbol()
        };
      }
      case 'percentage': {
        const formatted = absValue.toFixed(1);
        const parts = formatted.split('.');
        return {
          integerPart: sign + parts[0],
          decimalPart: parts[1] ? `,${parts[1]}` : '',
          symbol: ''
        };
      }
      case 'decimal': {
        const formatted = absValue.toFixed(2);
        const parts = formatted.split('.');
        return {
          integerPart: sign + parts[0],
          decimalPart: parts[1] ? `,${parts[1]}` : '',
          symbol: ''
        };
      }
      default: {
        const formatted = new Intl.NumberFormat('tr-TR').format(Math.round(absValue));
        return {
          integerPart: sign + formatted,
          decimalPart: '',
          symbol: ''
        };
      }
    }
  };

  const { integerPart, decimalPart, symbol } = formatValue(displayValue);

  return (
    <span
      ref={elementRef}
      className={`${className} tabular-nums inline-flex items-baseline`}
    >
      {prefix && <span className="mr-0.5 opacity-70 font-bold shrink-0">{prefix}</span>}
      {symbol && <span className="mr-0.5 opacity-70 font-bold shrink-0">{symbol}</span>}
      <span className="shrink-0">{integerPart}</span>
      {decimalPart && (
        <span className={smallDecimals ? 'text-[0.55em] leading-none opacity-60 font-black' : ''}>
          {decimalPart}
        </span>
      )}
      {suffix && <span className="ml-0.5 opacity-70 font-bold shrink-0">{suffix}</span>}
    </span>
  );
};

export default AnimatedCounter;
