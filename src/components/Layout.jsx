import React, { useContext, useState } from "react";
import { CryptoContext } from "../context/CryptoContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Layout = ({ children }) => {
  const {
    setSearch,
    search,
    filteredCoin,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
  } = useContext(CryptoContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      setSuggestions(
        filteredCoin
          .filter(
            (coin) =>
              coin.name.toLowerCase().startsWith(value.toLowerCase()) ||
              coin.symbol.toLowerCase().startsWith(value.toLowerCase())
          )
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  const toggleLanguage = (lang) => {
    // console.log("Changing language to:", lang); 
    i18n.changeLanguage(lang);
  };

  const toggleMenu = () => {
    // console.log("Toggling menu, isMenuOpen:", !isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-md p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            {t("appName")}
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={handleSearch}
                className={`pl-10 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
                aria-label={t("searchPlaceholder")}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-12 left-0 right-0 rounded-lg shadow-lg z-40 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {suggestions.map((coin) => (
                      <li
                        key={coin.id}
                        className="px-4 py-2 hover:bg-cyan-500 hover:text-white cursor-pointer"
                        onClick={() => setSearch(coin.name)}
                      >
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <select
              value={i18n.language} // Bind to current language
              onChange={(e) => toggleLanguage(e.target.value)}
              className={`p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 hidden lg:block ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-200"
              }`}
              aria-label={t("language")}
            >
              <option value="en">{t("english")}</option>
              <option value="hi">{t("hindi")}</option>
            </select>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 hidden lg:block"
              aria-label={t("toggleTheme")}
            >
              {theme === "dark" ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-900" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 lg:hidden"
              aria-label={t("toggleMenu")}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: "500px" }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-4 mt-2 z-50 overflow-visible min-h-fit`}
            >
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={handleSearch}
                  className={`w-full pl-10 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === "dark"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                  aria-label={t("searchPlaceholder")}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-gray-400"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
                {suggestions.length > 0 && (
                  <ul
                    className={`absolute top-12 left-0 right-0 rounded-lg shadow-lg z-40 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {suggestions.map((coin) => (
                      <li
                        key={coin.id}
                        className="px-4 py-2 hover:bg-cyan-500 hover:text-white cursor-pointer"
                        onClick={() => setSearch(coin.name)}
                      >
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 ${
                    theme === "dark"
                      ? "bg-gray-900 text-white border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-200"
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
                  className={`p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 ${
                    theme === "dark"
                      ? "bg-gray-900 text-white border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-200"
                  }`}
                  aria-label={t("filterLabel")}
                >
                  <option value="all">{t("allCoins")}</option>
                  <option value="gainers">{t("gainers")}</option>
                  <option value="losers">{t("losers")}</option>
                </select>
                <select
                  value={i18n.language} // Bind to current language
                  onChange={(e) => toggleLanguage(e.target.value)}
                  className={`p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 ${
                    theme === "dark"
                      ? "bg-gray-900 text-white border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-200"
                  }`}
                  aria-label={t("language")}
                >
                  <option value="en">{t("english")}</option>
                  <option value="hi">{t("hindi")}</option>
                </select>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-700 flex items-center gap-2"
                  aria-label={t("toggleTheme")}
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <MoonIcon className="h-6 w-6 text-gray-900" />
                  )}
                  {theme === "dark" ? t("lightMode") : t("darkMode")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {filteredCoin.length === 0 && search && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-red-500 text-center">
            {t("noResults", { search })}
          </p>
        </div>
      )}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
