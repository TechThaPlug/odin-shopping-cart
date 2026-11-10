import { useCallback, useEffect, useState } from "react";

export function useFetch(url) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Server error: " + response.status);
        }

        const data = await response.json();
        setState({ data, error: null, loading: false });
      } catch (error) {
        if (error.name !== "AbortError") {
          setState({ data: null, error, loading: false });
        }
      }
    }

    load();

    return () => controller.abort();
  }, [url, attempt]);

  const retry = useCallback(() => {
    setState({ data: null, error: null, loading: true });
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, retry };
}
