import { useState, useEffect } from "react";
import { t } from "i18next";
import i18n from "@/lib/i18n";
export const LoadingRedirect = () => {

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  const loadingSteps = [
    { key: 'initializing', duration: 1000 },
    { key: 'connecting', duration: 800 },
    { key: 'loadingContent', duration: 1200 },
    { key: 'processingData', duration: 900 },
    { key: 'preparingExperience', duration: 700 },
    { key: 'almostReady', duration: 600 },
    { key: 'finalizing', duration: 500 }
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 8 + 2, 100);
        return newProgress;
      });
    }, 200);

    // Step progression
    let stepTimeout: string | number | NodeJS.Timeout | undefined;
    const progressSteps = () => {
      if (currentStep < loadingSteps.length - 1) {
        stepTimeout = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, loadingSteps[currentStep].duration);
      }
    };

    progressSteps();

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
      clearTimeout(stepTimeout);
    };
  }, [currentStep]);

  const dir = typeof i18n.dir === "function" ? i18n.dir() : "ltr";
  const currentStepText = t(loadingSteps[currentStep]?.key || 'loading');

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="text-center space-y-8 p-8">
        {/* Logo/Brand Area */}
        <div className="space-y-4">
          <div className="relative mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded animate-pulse"></div>
              </div>
            </div>
            {/* Floating rings */}
            <div className="absolute inset-0 w-20 h-20 border-2 border-blue-300 dark:border-blue-600 rounded-2xl animate-ping opacity-20"></div>
            <div className="absolute inset-2 w-16 h-16 border border-blue-400 dark:border-blue-500 rounded-xl animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h1 className="text-2xl font-bold text-foreground arabic-text">{t('welcome')}</h1>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6">
          <div className="relative w-64 mx-auto">
            <div className="flex space-x-1 rtl:space-x-reverse justify-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-12 bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 rounded-full"
                  style={{
                    animation: `wave 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-lg font-medium text-foreground arabic-text">
              {currentStepText}{dots}
            </p>

            {/* Progress Bar */}
            <div className="w-64 mx-auto bg-muted rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-500 dark:via-blue-400 dark:to-blue-300 h-full rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>

            <div className="flex items-center justify-between w-64 mx-auto">
              <p className="text-sm text-muted-foreground arabic-text">{t('pleaseWait')}</p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{Math.round(progress)}%</p>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {loadingSteps.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-full ${index < currentStep
                    ? 'w-8 h-2 bg-blue-600 dark:bg-blue-500'
                    : index === currentStep
                      ? 'w-6 h-2 bg-blue-500 dark:bg-blue-400 animate-pulse'
                      : 'w-2 h-2 bg-muted'
                  }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-300 dark:bg-blue-700 rounded-full filter blur-2xl animate-float-delayed"></div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 40%, 100% {
            transform: scaleY(0.4);
            opacity: 0.3;
          }
          20% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-3deg);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};