import axios from "../helpers/axois";
import { useEffect, useState } from "react";

const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        (async () => {
          const res = await axios.get(url);
          setData(res.data);
        })();
      } catch (error) {
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, dependencies);
  return { isError, data, isLoading };
};

export default useFetch;
