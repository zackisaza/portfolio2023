import { useEffect, useRef } from "react";
import { useCanvasBudget } from "../context/CanvasBudgetContext";

// Lightweight intersection watcher that adjusts the canvas budget when a section above becomes visible
const SectionSentinel = ({ sectionIndex, rootMargin = "200px", threshold = 0.05 }) => {
  const { suspendAboveOf, setSuspendAboveOf } = useCanvasBudget();
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && suspendAboveOf !== null && sectionIndex < suspendAboveOf) {
          // Lower the suspension floor so upper sections can remount progressively
          setSuspendAboveOf(sectionIndex);
        }
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [suspendAboveOf, setSuspendAboveOf, sectionIndex, rootMargin, threshold]);

  // Invisible, 1x1 pixel anchor at the top-left of the section container
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, pointerEvents: "none" }}
    />
  );
};

export default SectionSentinel;
