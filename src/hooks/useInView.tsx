import { useEffect, useRef, useState, type RefObject } from "react";

export const useInView = ({ threshold = 0.1 }: { threshold?: number }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px",
        root: null,
      },
    );
    if (ref.current) {
      observer.observe(ref.current!);
    }
    return () => {
      observer.disconnect();
    };
  }, [threshold]);
  return [ref, inView] as [RefObject<HTMLDivElement>, boolean];
};
