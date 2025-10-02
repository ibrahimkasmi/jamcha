// src/shared/hooks/usePerformanceMonitor.ts
import { useState, useEffect, useRef } from "react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
}

export const usePerformanceMonitor = (
  componentName: string
): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
  });

  const startTime = useRef(performance.now());
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();

    const loadTime = mountTime.current - startTime.current;

    // Measure render time
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const renderTime = entries.reduce(
        (acc, entry) => acc + entry.duration,
        0
      );

      setMetrics({
        loadTime,
        renderTime,
      });

      // Log performance metrics in development
      if (process.env.NODE_ENV === "development") {
        console.log(`${componentName} Performance:`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          renderTime: `${renderTime.toFixed(2)}ms`,
        });
      }
    });

    observer.observe({ entryTypes: ["measure", "navigation"] });

    return () => {
      observer.disconnect();
    };
  }, [componentName]);

  return metrics;
};
