"use client";

import { useState, ChangeEvent, MouseEvent, FocusEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

// Theme Color Mapping (Customize as Needed)
const themeColorMap: Record<string, string> = {
  love: "bg-red-500",
  heartbreak: "bg-purple-500",
  sadness: "bg-blue-500",
  party: "bg-yellow-500",
  motivation: "bg-green-500",
  wealth: "bg-teal-500",
  christmas: "bg-red-400",
  freedom: "bg-indigo-500",
  confidence: "bg-orange-500",
  empowerment: "bg-pink-500",
  friendship: "bg-lime-500",
  desire: "bg-fuchsia-500",
};

// Default Colors if Theme is Not in Map
const defaultColors = [
  "bg-blue-600", "bg-green-600", "bg-yellow-600", "bg-purple-600",
  "bg-red-600", "bg-pink-600", "bg-indigo-600", "bg-teal-600",
];

const Playground = () => {
  const [themeInput, setThemeInput] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<string[]>([]);
  const [showPopularThemes, setShowPopularThemes] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");
  const [tempo, setTempo] = useState<number>(120);
  const [popularityScore, setPopularityScore] = useState<number | null>(null);

  // Full theme list
  const allThemes: string[] = [
    "love", "heartbreak", "sadness", "party", "motivation", "wealth",
    "christmas", "freedom", "confidence", "empowerment", "friendship", "desire",
  ];

  // Assigns a color based on theme, falls back to default colors if not found
  const getThemeColor = (theme: string) => {
    return themeColorMap[theme] || defaultColors[theme.length % defaultColors.length];
  };

  // Show popular themes when input is clicked
  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!themeInput) {
      setFilteredThemes(allThemes);
      setShowPopularThemes(true);
    }
  };

  // Update suggestions based on user input
  const handleThemeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    setThemeInput(input);
    setShowPopularThemes(false);

    if (input.length > 0) {
      const matches = allThemes.filter(theme => theme.includes(input)).slice(0, 5);
      setFilteredThemes(matches);
    } else {
      setFilteredThemes([]);
    }
  };

  // Add selected theme (limit 3)
  const selectTheme = (theme: string) => {
    if (selectedThemes.length < 3 && !selectedThemes.includes(theme)) {
      setSelectedThemes([...selectedThemes, theme]);
    }
    setThemeInput("");
    setFilteredThemes([]);
  };

  // Remove selected theme
  const removeTheme = (theme: string) => {
    setSelectedThemes(selectedThemes.filter(t => t !== theme));
  };

  // Handle form submission
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPopularityScore(Math.floor(Math.random() * 100));
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white px-4">
      <Navbar />
      <div className="fixed inset-0 w-full h-full -z-10">
        <WavyBackground />
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 w-full max-w-3xl bg-black bg-opacity-70 p-8 rounded-lg shadow-lg mt-16">
        <h1 className="text-5xl font-bold text-center">Song Popularity Playground</h1>
        <p className="text-lg text-gray-300 text-center mt-2">
          Experiment with themes, keywords, and tempo to see if your song is a hit!
        </p>

        {/* Theme Selection */}
        <div className="bg-gray-800 bg-opacity-90 p-6 mt-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Select Up to 3 Themes</h2>
          <input
            type="text"
            placeholder="Type a theme..."
            value={themeInput}
            onChange={handleThemeInputChange}
            onFocus={handleInputFocus}
            className="mt-2 w-full p-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {filteredThemes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filteredThemes.map((theme, index) => (
                <button
                  key={index}
                  className={`${getThemeColor(theme)} text-white px-3 py-1 rounded-md hover:opacity-80 transition`}
                  onClick={() => selectTheme(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
          )}

          {/* Display selected themes */}
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedThemes.map((theme, index) => (
              <span key={index} className={`${getThemeColor(theme)} text-white px-3 py-1 rounded-md`}>
                {theme}{" "}
                <button className="ml-1 text-white" onClick={() => removeTheme(theme)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Keywords Input */}
        <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Enter Keywords</h2>
          <input
            type="text"
            placeholder="Type some keywords..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-2 w-full p-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tempo Slider */}
        <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Set Tempo</h2>
          <input
            type="range"
            min="60"
            max="160"
            step="1"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="w-full mt-2 accent-blue-500"
          />
          <p className="text-lg text-gray-300 mt-2 text-center">{tempo} BPM</p>
        </div>

        {/* Predict Button */}
        <button
          className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Is It a Hit?
        </button>

        {/* Display Popularity Score */}
        {popularityScore !== null && (
          <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold">Predicted Popularity Score:</h2>
            <p className="text-5xl font-bold text-blue-500 mt-2">{popularityScore}/100</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
