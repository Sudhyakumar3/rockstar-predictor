"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";

export default function About() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopSongs = async () => {
    if (!month || !year) {
      alert("Please select a month and a year.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/analytics/top-songs?month=${month}&year=${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setTopSongs(data.top_songs || []);
    } catch (error) {
      console.error("Error fetching top songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      <motion.div
        className="relative z-10 w-full max-w-4xl mt-16 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold text-center mb-8 tracking-wide">
          🎶 Data Analysis
        </h1>

        {/* Filter Section */}
        <motion.div
          className="flex justify-between items-center mb-6 bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col">
            <label className="text-lg mb-2" htmlFor="month">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="text-black p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-lg mb-2" htmlFor="year">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="text-black p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Fetch Button */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={fetchTopSongs}
            className="relative inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg hover:shadow-blue-600 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-cyan-200"
          >
            {loading ? "Loading..." : "Get Top 5 Songs"}
          </button>
        </motion.div>

        {/* Top 5 Songs Section */}
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Top 5 Most Popular Songs 🎧
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center animate-pulse">
              Fetching data...
            </p>
          ) : topSongs.length === 0 ? (
            <p className="text-gray-400 text-center">
              No data available for the selected month and year.
            </p>
          ) : (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {topSongs.map((song, index) => (
                <motion.div
                  key={index}
                  className="flex items-center bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-blue-500 transition-transform transform hover:scale-105"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <img
                    src={song.image_url || "/default-song.jpg"}
                    alt={song.title}
                    className="w-20 h-20 bg-gray-600 rounded-lg object-cover shadow-md"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-bold">{song.title}</h3>
                    <p className="text-gray-400">
                      {song.artist} |{" "}
                      <span className="italic">
                        Themes:{" "}
                        {Array.isArray(song.themes)
                          ? song.themes.join(", ")
                          : "No themes available"}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

                {/* t-SNE Visualization Section */}
                <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">
            t-SNE Visualization of Songs by Themes
          </h2>
          <div style={{ textAlign: "center" }}>
            <iframe
              src="http://127.0.0.1:8050/"
              style={{
                display: "block",
                marginLeft: "-75px",
                width: "1200px",
                height: "800px",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
              title="Dash t-SNE Visualization"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
