import { useEffect, useState } from "react";
import { getCoinData } from "../services/coingeckoAPI";

export function useFetchCrypto(coinId, days) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getCoinData(coinId, days);
        setData(result);
      } catch (err) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [coinId, days]);

  return { data, loading, error };
}
