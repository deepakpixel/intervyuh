import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';

function useFetch(method, url, payload = '') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { softLogout } = useAuth();

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    fetch(url, {
      method: method || 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: method === 'GET' ? undefined : payload,
      credentials: 'include',
    })
      .then((data) => data.json())
      .then((data) => {
        setLoading(false);
        setData(data);
        if (data.authenticated === false) softLogout();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });

    return () => controller.abort();
  }, [method, url, payload, softLogout]);

  return { data, loading, error };
}
export default useFetch;
