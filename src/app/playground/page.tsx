"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";

const Playground = () => {
  const [themeInput, setThemeInput] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [sentiment, setSentiment] = useState(0);
  const [popularityScore, setPopularityScore] = useState<number | null>(null);

  const themeColorMap: Record<string, string> = {
    love: "bg-pink-600 bg-opacity-50",
    heartbreak: "bg-purple-500 bg-opacity-50",
    power: "bg-red-600 bg-opacity-50",
    party: "bg-yellow-500 bg-opacity-50",
    success: "bg-green-600 bg-opacity-50",
  };

  const getThemeColor = (theme: string) => {
    return themeColorMap[theme] || "bg-gray-700 bg-opacity-50";
  };

  const handleThemeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    setThemeInput(input);
    setFilteredThemes(
      Object.keys(themeColorMap).filter((theme) => theme.includes(input)).slice(0, 5)
    );
  };

  const selectTheme = (theme: string) => {
    if (selectedThemes.length < 3 && !selectedThemes.includes(theme)) {
      setSelectedThemes([...selectedThemes, theme]);
    }
    setThemeInput("");
    setFilteredThemes([]);
  };

  const removeTheme = (theme: string) => {
    setSelectedThemes(selectedThemes.filter((t) => t !== theme));
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/predict-popularityP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themes: selectedThemes, sentiment, keywords }),
      });
      const result = await response.json();
      setPopularityScore(result.popularityScore);
    } catch (error) {
      console.error("Error predicting popularity:", error);
      setPopularityScore(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-black text-white px-4 overflow-hidden">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-[20%] z-10 w-full max-w-3xl bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-lg"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-text"
        >
          Song Popularity Playground
        </motion.h1>
        
        <p className="text-lg text-gray-300 text-center mt-2">
          Experiment with themes, keywords, and sentiment to see if your song is a hit!
        </p>

        {/* Theme Selection */}
        <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold">Select Up to 3 Themes</h2>
          <input
            type="text"
            placeholder="Type a theme..."
            value={themeInput}
            onChange={handleThemeInputChange}
            className="mt-2 w-full p-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {filteredThemes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filteredThemes.map((theme, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-white px-3 py-1 rounded-md ${getThemeColor(theme)}`}
                  onClick={() => selectTheme(theme)}
                >
                  {theme}
                </motion.button>
              ))}
            </div>
          )}

          {/* Display selected themes */}
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedThemes.map((theme, index) => (
              <span
                key={index}
                className={`${getThemeColor(theme)} text-white px-3 py-1 rounded-md`}
              >
                {theme} <button className="ml-1 text-white" onClick={() => removeTheme(theme)}>✕</button>
              </span>
            ))}
          </div>
        </div>

        {/* Sentiment Slider */}
        <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold">Set Sentiment</h2>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={sentiment}
            onChange={(e) => setSentiment(parseFloat(e.target.value))}
            className="w-full accent-red-500"
          />
          <p className="text-lg text-gray-300 mt-2 text-center">Sentiment Score: {sentiment.toFixed(2)}</p>
        </div>

        {/* Predict Button */}
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)" }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Is It a Hit?
        </motion.button>

        {/* Display Popularity Score */}
        {popularityScore !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 mt-6 rounded-lg shadow-md text-center w-full"
          >
            <h2 className="text-2xl font-semibold">Predicted Popularity Score:</h2>
            <p className="text-5xl font-bold text-blue-500 mt-2">{popularityScore}/100</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Playground;
