
import React, { useRef, useEffect, useState } from "react";

/**
 * Fade-in and scale animation for section entry on scroll/view
 */
const AnimatedSection: React.FC<React.PropsWithChildren<{ delay?: number }>> = ({
  children,
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      const trigger = window.innerHeight * 0.88;
      if (rect.top <= trigger && !isInView) setIsInView(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line
  }, [isInView]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out
        ${isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
export default AnimatedSection;
