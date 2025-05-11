import React, { useContext, useEffect, useState, useMemo } from "react";
import { CryptoContext } from "../context/CryptoContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import Pagination from "./Pagination";
import ScrollToTop from "./ScrollToTop";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CardCoin = () => {
  const {
    filteredCoin,
    search,
    error,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
  } = useContext(CryptoContext);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(filteredCoin.length / itemsPerPage);
  const displayedItems = useMemo(
    () =>
      filteredCoin.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredCoin, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterBy]);

  if (!filteredCoin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <Layout>
      <motion.div
        className="container mx-auto p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
              aria-label={t("sortLabel")}
            >
              <option value="market_cap_desc">{t("marketCapDesc")}</option>
              <option value="market_cap_asc">{t("marketCapAsc")}</option>
              <option value="current_price_desc">{t("priceDesc")}</option>
              <option value="current_price_asc">{t("priceAsc")}</option>
              <option value="price_change_percentage_24h_desc">
                {t("change24hDesc")}
              </option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
              aria-label={t("filterLabel")}
            >
              <option value="all">{t("allCoins")}</option>
              <option value="gainers">{t("gainers")}</option>
              <option value="losers">{t("losers")}</option>
            </select>
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayedItems.map((coin) => (
            <motion.div
              key={coin.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to={`/coin/${coin.id}`}>
                <div
                  className={`rounded-xl p-4 shadow-lg ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-12 h-12"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{coin.name}</h3>
                  <p className="text-gray-400">
                    ₹{coin.current_price.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      coin.price_change_percentage_24h < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <ScrollToTop />
      </motion.div>
    </Layout>
  );
};

export default React.memo(CardCoin);
