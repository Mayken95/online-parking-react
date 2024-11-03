import { useState, useEffect } from "react";

export const useFetchWithAuthTrigger = (url, token, method = 'GET', data = null, trigger = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    if (!trigger || !url || !token) return; // Solo ejecuta si trigger está activo

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const options = {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          }
        };

        if (data) {
          options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setResponseData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token, method, data, trigger]); // Elimina internalTrigger y usa solo trigger

  return { loading, error, responseData };
};
