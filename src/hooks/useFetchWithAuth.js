import { useState, useEffect } from "react";

export const useFetchWithAuth = (url, token, method = 'GET', data = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    if (!url || !token) return;

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

    if (token && url) {
      fetchData();
    }
  }, [url, token, method, data]);

  return { loading, error, responseData };
};
