import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { PacmanLoader } from "react-spinners";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  zoomPlugin
);

const CoinDetails = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30");
  const { theme } = React.useContext(ThemeContext);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        setLoading(true);
        const [coinRes, chartRes] = await Promise.all([
          axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=inr&days=${timeRange}`
          ),
        ]);
        setCoin(coinRes.data);
        setChartData({
          labels: chartRes.data.prices.map((price) =>
            new Date(price[0]).toLocaleDateString()
          ),
          datasets: [
            {
              label: t("price"),
              data: chartRes.data.prices.map((price) => price[1]),
              borderColor: "#38B2AC",
              fill: false,
            },
          ],
        });
        setError("");
      } catch (error) {
        setError("Error fetching coin details: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoinDetails();
  }, [id, timeRange, t]);

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
        pan: { enabled: true, mode: "x" },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader loading={loading} size={25} color="#38B2AC" />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 flex items-center gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16" />
        <div>
          <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
          <p className="text-gray-200">{coin.symbol.toUpperCase()}</p>
        </div>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <motion.div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">{t("marketData")}</h2>
          <p>
            {t("price")}: ₹{coin.market_data.current_price.inr.toLocaleString()}
          </p>
          <p
            className={
              coin.market_data.price_change_percentage_24h < 0
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {t("change24h")}:{" "}
            {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
          <p>
            {t("marketCap")}: ₹
            {coin.market_data.market_cap.inr.toLocaleString()}
          </p>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t("priceHistory")}</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
                aria-label={t("timeRange")}
              >
                <option value="1">{t("oneDay")}</option>
                <option value="7">{t("sevenDays")}</option>
                <option value="30">{t("thirtyDays")}</option>
              </select>
            </div>
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>
        <motion.div
          className={`rounded-xl p-6 shadow-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">{t("description")}</h2>
          <div
            className="text-gray-300"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
          <a
            href={coin.links.homepage[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600"
          >
            {t("visitWebsite")}
          </a>
        </motion.div>
      </div>
      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
      >
        {t("backToList")}
      </Link>
    </motion.div>
  );
};

export default CoinDetails;
