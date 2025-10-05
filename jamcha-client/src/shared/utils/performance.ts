declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }

  interface MemoryInfo {
    readonly jsHeapSizeLimit: number;
    readonly totalJSHeapSize: number;
    readonly usedJSHeapSize: number;
  }
}

// src/shared/utils/performance.ts
export const performanceUtils = {
  // Measure and report performance metrics
  measurePerformance: (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(`${name} took ${end - start} milliseconds`);
    }

    return end - start;
  },

  // Debounce function for performance optimization
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for performance optimization
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Preload images for better UX
  preloadImages: (urls: string[]): Promise<void[]> => {
    return Promise.all(
      urls.map(
        (url) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = url;
          })
      )
    );
  },

  // Report Core Web Vitals
  reportWebVitals: (metric: { name: string; id: string; value: number }) => {
    if (process.env.NODE_ENV === "production") {
      // Send to analytics service (Google Analytics, etc.)
      window.gtag?.("event", metric.name, {
        event_category: "Web Vitals",
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    } else {
      console.log(metric);
    }
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if ("memory" in performance) {
      const memory = (performance as Performance & { memory: MemoryInfo }).memory;
      return {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  },
};
