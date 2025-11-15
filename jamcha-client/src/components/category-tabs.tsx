import { useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { CATEGORIES } from "@/lib/constants";
import { Link } from "wouter";

export function CategoryTabs() {
  const { selectedCategory, setSelectedCategory } = useStore();
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tabsContainer = tabsRef.current;
      const activeTab = activeTabRef.current;

      const containerWidth = tabsContainer.offsetWidth;
      const activeTabWidth = activeTab.offsetWidth;
      const activeTabOffset = activeTab.offsetLeft;

      tabsContainer.scrollTo({
        left: activeTabOffset - containerWidth / 2 + activeTabWidth / 2,
        behavior: "smooth",
      });
    }
  }, [selectedCategory]);

  return (
    <section className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 lg:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={tabsRef}
          className="relative flex overflow-x-auto py-3 space-x-4 scrollbar-hide"
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            const href = category.id === "all" ? "/" : `/${category.id}`;

            return (
              <Link
                key={category.id}
                href={href}
                ref={isActive ? activeTabRef : null}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  relative flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-full
                  text-sm font-medium transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <i
                  className={`${category.icon} ${
                    isActive ? "text-white" : "text-primary"
                  }`}
                ></i>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
