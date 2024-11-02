import { useState, useEffect } from "react";

export const useFetchWithAuthTrigger = (url, token, method = 'GET', data = null, trigger = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [internalTrigger, setInternalTrigger] = useState(trigger); // Controla el trigger internamente

  useEffect(() => {
    if (!internalTrigger || !url || !token) return; // Solo ejecuta si internalTrigger está activo

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
        setInternalTrigger(false); // Desactiva el trigger despuésss de la solicitud
      }
    };

    fetchData();
  }, [url, token, method, data, internalTrigger]); 

  // Permite al componente padre activar el trigger
  useEffect(() => {
    if (trigger) setInternalTrigger(true);
  }, [trigger]);

  return { loading, error, responseData };
};
