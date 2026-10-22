import { useEffect } from "react";

// Dá a cada página um título próprio na aba do navegador e no Google.
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | Sowe Studio`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
