import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { PacmanLoader } from "react-spinners";

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [cryptoCoin, setCryptoCoin] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [filterBy, setFilterBy] = useState("all");

  const fetchCryptoCoin = async () => {
    try {
      setLoading(true);
      // console.log(`Fetching coins with sortBy: ${sortBy}`);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=${sortBy}&per_page=100&page=1&sparkline=false`
      );
      let data = response.data;
      if (sortBy === "market_cap_asc") {
        data = [...data].sort((a, b) => a.market_cap - b.market_cap);
      }
      // console.log("API response:", data.slice(0, 5)); 
      setCryptoCoin(data);
      setError("");
    } catch (error) {
      // console.error("Error fetching crypto coins:", error);
      setError("Error fetching crypto coins: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoCoin();
  }, [sortBy]);

  // Debounced search
  const debouncedSearch = (value) => {
    const timeout = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(timeout);
  };

  const filteredCoin = useMemo(() => {
    let coins = cryptoCoin;
    if (search) {
      coins = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterBy === "gainers") {
      coins = coins.filter((coin) => coin.price_change_percentage_24h > 0);
    } else if (filterBy === "losers") {
      coins = coins.filter((coin) => coin.price_change_percentage_24h < 0);
    }
    return coins;
  }, [cryptoCoin, search, filterBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader loading={loading} size={25} color="#38B2AC" />
      </div>
    );
  }

  return (
    <CryptoContext.Provider
      value={{
        cryptoCoin,
        setCryptoCoin,
        search,
        setSearch: debouncedSearch,
        filteredCoin,
        loading,
        setLoading,
        error,
        setError,
        sortBy,
        setSortBy,
        filterBy,
        setFilterBy,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
