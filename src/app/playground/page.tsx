"use client";

import { useState, ChangeEvent, MouseEvent, FocusEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

interface ThemePopularity {
  name: string;
  count: number;
}

const Playground = () => {
  const [themeInput, setThemeInput] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<string[]>([]);
  const [showPopularThemes, setShowPopularThemes] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");
  const [tempo, setTempo] = useState<number>(120);
  const [popularityScore, setPopularityScore] = useState<number | null>(null);

  // Adjust wave properties dynamically based on tempo
  const waveFrequency = Math.max(3, (tempo - 60) / 6);
  const waveAmplitude = Math.max(2, (tempo - 60) / 10);
  const waveSpeed = Math.max(0.5, (200 - tempo) / 50);

  // Full theme list
  const allThemes: string[] = [
    "power", "disillusionment", "toxic relationship", "intimacy", "pride", "murder", "trauma", "darkness",
    "family", "regret", "responsibility", "hedonism", "violence", "travel", "grief", "sex", "love",
    "observation", "indulgence", "relationships", "confusion", "doubt", "hustle", "drama", "outcasts",
    "whiskey", "holiday", "deception", "isolation", "empowerment", "trust", "pain", "goodness", "opposition",
    "lifestyle", "celebration", "party", "self-empowerment", "vengeance", "mistrust", "carelessness", "excess",
    "abandonment", "flirtation", "solidarity", "dislike", "confidence", "poverty", "christmas", "protection",
    "manipulation", "obsession", "ambition", "guilt", "streetlife", "attraction", "resilience", "loathing",
    "forever", "joy", "sadness", "hate", "denial", "loyalty", "respect", "desire", "moving on", "liberation",
    "freedom", "vulnerability", "money", "anxiety", "loss", "summer", "popularity", "pleasure", "friendship",
    "happiness", "criticism", "swagger", "commitment", "seduction", "diss", "romance", "materialism",
    "affection", "drugs", "heartbreak", "uncertainty", "fear", "acceptance", "nostalgia", "fame",
    "cheating", "drinking", "betrayal", "longing", "infidelity", "jealousy", "devotion", "roots", "winter",
    "concern", "evil", "detachment", "mortality", "appreciation", "lies", "success", "insecurity", "struggle",
    "self-blame", "mockery", "anger", "fun", "self-love", "perseverance", "wealth", "paranoia", "frustration",
    "gratitude", "makeover", "desperation", "motivation", "dance", "loneliness", "toughness", "rebellion",
    "self-discovery", "innocence", "spirituality", "independence", "youth", "danger", "addiction",
    "revenge", "identity", "cheer", "sarcasm", "lust", "aggression", "forgiveness", "disappointment",
    "crime", "toxicity"
  ];

  // Popular themes list for autosuggest
  const themePopularity: ThemePopularity[] = [
    { name: "love", count: 135 }, { name: "heartbreak", count: 102 }, { name: "sadness", count: 57 },
    { name: "party", count: 47 }, { name: "motivation", count: 39 }, { name: "wealth", count: 29 },
    { name: "christmas", count: 21 }, { name: "freedom", count: 18 }, { name: "confidence", count: 15 },
    { name: "empowerment", count: 15 }, { name: "friendship", count: 14 }, { name: "desire", count: 14 }
  ];

  // Show popular themes when input is clicked
  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!themeInput) {
      setFilteredThemes(themePopularity.map(t => t.name));
      setShowPopularThemes(true);
    }
  };

  // Update suggestions based on user input
  const handleThemeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    setThemeInput(input);
    setShowPopularThemes(false);

    if (input.length > 0) {
      const matches = allThemes
        .filter(theme => theme.includes(input))
        .slice(0, 5);
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
    <div className="relative flex flex-col items-center h-screen bg-gray-900 text-white px-4">
      <Navbar />
      <div className="absolute top-0 w-full h-[100vh] overflow-hidden">
        <WavyBackground />
      </div>


      {/* Main Content Box */}
      <div className="absolute top-[20%] z-10 w-full max-w-3xl bg-black bg-opacity-70 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center">Song Popularity Playground</h1>
        <p className="text-lg text-gray-300 text-center mt-2">
          Experiment with themes, keywords, and tempo to see if your song is a hit!
        </p>

        {/* Theme Selection */}
        <div className="bg-gray-800 bg-opacity-90 p-6 mt-6 rounded-lg shadow-md w-full">
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
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
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
              <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                {theme}{" "}
                <button className="ml-1 text-white" onClick={() => removeTheme(theme)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Keywords Input */}
        <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold">Enter Keywords</h2>
          <input
            type="text"
            placeholder="Type some keywords..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-2 w-full p-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tempo Slider & Wave Visualization */}
        <div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md w-full">
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

          {/* Animated Wave */}
          <div className="relative w-full h-24 overflow-hidden mt-6 flex justify-center">
            <svg
              viewBox="0 0 100 20"
              className="absolute w-full h-full animate-wave"
              style={{
                animationDuration: `${waveSpeed}s`,
              }}
            >
              <path
                d={`M0 10 Q 10 ${10 - waveAmplitude}, 20 10 T 40 10 T 60 10 T 80 10 T 100 10`}
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-400 text-center mt-2">
            Faster waves at higher BPM, slower waves at lower BPM.
          </p>
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
          <div className="bg-gray-800 p-6 mt-6 rounded-lg shadow-md text-center w-full">
            <h2 className="text-2xl font-semibold">Predicted Popularity Score:</h2>
            <p className="text-5xl font-bold text-blue-500 mt-2">{popularityScore}/100</p>
          </div>
        )}
      </div>

      {/* Wave Animation */}
      <style>
        {`
          @keyframes waveMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50px); } /* More dramatic movement */
          }

          .animate-wave {
            animation: waveMove infinite linear;
          }
        `}
      </style>
    </div>
  );
};

export default Playground;