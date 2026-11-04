// CSS media query-ის შესაბამისობას React მდგომარეობად აბრუნებს.
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // საწყის მნიშვნელობას ეკრანის მიმდინარე პარამეტრიდან ვიღებთ.
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    // ეკრანის ზომის ცვლილებაზე მდგომარეობას ვაახლებთ და hook-ის დახურვისას listener-ს ვხსნით.
    const mediaQuery = window.matchMedia(query);
    const updateMatch = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, [query]);

  return matches;
}
