import { useState, useEffect } from 'react';

const useDataFetcher = (url, formatFunction = null) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const responseData = await response.json();
      
      if (Array.isArray(responseData)) {
        const formattedData = formatFunction 
          ? responseData.map(formatFunction)
          : responseData;
        
        setData(formattedData);
        setFilteredData(formattedData);
      } else {
        setData([]);
        setFilteredData([]);
      }
      setError(null);
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
      setError('Failed to fetch data.');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    setData,
    filteredData,
    setFilteredData,
    loading,
    error,
    refreshData: fetchData
  };
};

export default useDataFetcher;