"use client";

import { useState, ChangeEvent, MouseEvent, FocusEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

const Playground = () => {
  const [themeInput, setThemeInput] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<string[]>([]);
  const [showPopularThemes, setShowPopularThemes] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");
  const [sentiment, setSentiment] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(110);
  const [energy, setEnergy] = useState<number>(0.5);
  const [popularityScore, setPopularityScore] = useState<number | null>(null);

  const themeColorMap: Record<string, string> = {
    // Power & Strength
    power: "bg-red-600 bg-opacity-50",
    confidence: "bg-yellow-600 bg-opacity-50",
    empowerment: "bg-orange-600 bg-opacity-50",
    vengeance: "bg-red-700 bg-opacity-50",
    dominance: "bg-purple-700 bg-opacity-50",
  
    // Heartbreak & Negative Emotions
    heartbreak: "bg-purple-500 bg-opacity-50",
    sadness: "bg-blue-500 bg-opacity-50",
    grief: "bg-gray-500 bg-opacity-50",
    trauma: "bg-gray-700 bg-opacity-50",
    regret: "bg-gray-600 bg-opacity-50",
    disappointment: "bg-gray-400 bg-opacity-50",
    anxiety: "bg-blue-400 bg-opacity-50",
    depression: "bg-indigo-500 bg-opacity-50",
  
    // Party & Celebration
    party: "bg-yellow-500 bg-opacity-50",
    celebration: "bg-yellow-400 bg-opacity-50",
    lifestyle: "bg-orange-400 bg-opacity-50",
    dance: "bg-pink-500 bg-opacity-50",
    fun: "bg-green-500 bg-opacity-50",
    excitement: "bg-teal-500 bg-opacity-50",
  
    // Love & Relationships
    love: "bg-pink-600 bg-opacity-50",
    intimacy: "bg-red-400 bg-opacity-50",
    romance: "bg-pink-500 bg-opacity-50",
    attraction: "bg-red-500 bg-opacity-50",
    desire: "bg-pink-400 bg-opacity-50",
    flirtation: "bg-fuchsia-500 bg-opacity-50",
    affection: "bg-rose-400 bg-opacity-50",
  
    // Dark Themes
    murder: "bg-black bg-opacity-50",
    crime: "bg-gray-900 bg-opacity-50",
    danger: "bg-gray-800 bg-opacity-50",
    darkness: "bg-gray-700 bg-opacity-50",
    evil: "bg-gray-900 bg-opacity-50",
    betrayal: "bg-gray-600 bg-opacity-50",
    deception: "bg-gray-500 bg-opacity-50",
  
    // Success & Wealth
    success: "bg-green-600 bg-opacity-50",
    ambition: "bg-green-500 bg-opacity-50",
    money: "bg-green-700 bg-opacity-50",
    wealth: "bg-green-800 bg-opacity-50",
    fame: "bg-yellow-600 bg-opacity-50",
    popularity: "bg-yellow-500 bg-opacity-50",
  
    // Musical & Expressive
    nostalgia: "bg-indigo-400 bg-opacity-50",
    swagger: "bg-orange-500 bg-opacity-50",
    creativity: "bg-purple-600 bg-opacity-50",
    artistic: "bg-indigo-500 bg-opacity-50",
  
    // Conflict & Rebellion
    opposition: "bg-red-500 bg-opacity-50",
    rebellion: "bg-blue-700 bg-opacity-50",
    mistrust: "bg-gray-500 bg-opacity-50",
    arrogance: "bg-yellow-700 bg-opacity-50",
    tough: "bg-gray-700 bg-opacity-50",
  
    // Peace & Positivity
    peace: "bg-blue-400 bg-opacity-50",
    forgiveness: "bg-teal-400 bg-opacity-50",
    gratitude: "bg-green-400 bg-opacity-50",
    loyalty: "bg-blue-500 bg-opacity-50",
    appreciation: "bg-green-300 bg-opacity-50",
  
    // Toxic & Negative Behaviors
    toxicity: "bg-purple-900 bg-opacity-50",
    toxic_relationship: "bg-red-800 bg-opacity-50",
    drinking: "bg-blue-900 bg-opacity-50",
    drugs: "bg-indigo-800 bg-opacity-50",
    obsession: "bg-gray-700 bg-opacity-50",
    jealousy: "bg-green-600 bg-opacity-50",
    lies: "bg-gray-400 bg-opacity-50",
  
    // Social & Society
    streetlife: "bg-yellow-700 bg-opacity-50",
    authenticity: "bg-orange-500 bg-opacity-50",
    trust: "bg-blue-600 bg-opacity-50",
    solidarity: "bg-blue-500 bg-opacity-50",
    resilience: "bg-teal-600 bg-opacity-50",
  
    // Adventure & Exploration
    travel: "bg-teal-500 bg-opacity-50",
    discovery: "bg-blue-400 bg-opacity-50",
    freedom: "bg-cyan-500 bg-opacity-50",
    escape: "bg-cyan-600 bg-opacity-50",
  
    // Seasons & Nature
    summer: "bg-yellow-500 bg-opacity-50",
    winter: "bg-blue-500 bg-opacity-50",
    holiday: "bg-red-400 bg-opacity-50",
    christmas: "bg-green-600 bg-opacity-50",
    roots: "bg-brown-600 bg-opacity-50",
  
    // Personal Growth & Self
    self_empowerment: "bg-pink-500 bg-opacity-50",
    perseverance: "bg-green-500 bg-opacity-50",
    self_love: "bg-orange-400 bg-opacity-50",
    self_discovery: "bg-indigo-400 bg-opacity-50",
    motivation: "bg-yellow-600 bg-opacity-50",
    ambition2: "bg-green-700 bg-opacity-50",
  
    // Miscellaneous Negative
    frustration: "bg-gray-700 bg-opacity-50",
    loathing: "bg-gray-500 bg-opacity-50",
    paranoia: "bg-purple-700 bg-opacity-50",
    detachment: "bg-blue-700 bg-opacity-50",
    fear: "bg-blue-900 bg-opacity-50",
  
    // Miscellaneous Positive
    cheer: "bg-yellow-400 bg-opacity-50",
    innocence: "bg-white bg-opacity-50",
    optimism: "bg-teal-400 bg-opacity-50",
  };
  

  const defaultColors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-purple-600",
    "bg-red-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-teal-600",
  ];

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

  const getThemeColor = (theme: string) => {
    return themeColorMap[theme] || defaultColors[theme.length % defaultColors.length];
  };

  // Handle theme input change
  const handleThemeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();
    setThemeInput(input);
    setShowPopularThemes(false);

    if (input.length > 0) {
      setFilteredThemes(
        Object.keys(themeColorMap)
          .filter((theme) => theme.includes(input))
          .slice(0, 5)
      );
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
    setSelectedThemes(selectedThemes.filter((t) => t !== theme));
  };

  // Handle form submission
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Collect data to send to the Flask API
    const data = {
        themes: selectedThemes,
        sentiment: sentiment,
        tempo: tempo,
        energy: energy,
        keywords: keywords
    };

    // Send POST request to Flask backend
    try {
        const response = await fetch('http://localhost:5000/predict-popularityP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        setPopularityScore(result.popularityScore);
    } catch (error) {
        console.error('Error predicting popularity:', error);
        setPopularityScore(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white px-4">
      <Navbar />

      {/* Main Content Box */}
      <div className="absolute top-[20%] z-10 w-full max-w-3xl bg-black bg-opacity-70 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-center">Song Popularity Playground</h1>
        <p className="text-lg text-gray-300 text-center mt-2">
          Experiment with themes, keywords, and sentiment to see if your song is a hit!
        </p>

        {/* Theme Selection */}
        <div className="bg-gray-800 bg-opacity-90 p-6 mt-6 rounded-lg shadow-md w-full">
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
                <button
                  key={index}
                  className={`text-white px-3 py-1 rounded-md ${getThemeColor(theme)}`}
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
              <span
                key={index}
                className={`${getThemeColor(theme)} text-white px-3 py-1 rounded-md`}
              >
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

        {/* Sentiment Slider */}
<div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md w-full">
  <h2 className="text-xl font-semibold">Set Sentiment</h2>
  
  <div className="flex items-center justify-between mt-2">
    {/* Negative Sentiment Label */}
    <span className="text-gray-300 text-sm">Negative (-1)</span>
    
    {/* Sentiment Slider */}
    <input
      type="range"
      min="-1"
      max="1"
      step="0.05"
      value={sentiment}
      onChange={(e) => setSentiment(parseFloat(e.target.value))}
      className="w-full mx-4 accent-red-500"
    />
    
    {/* Positive Sentiment Label */}
    <span className="text-gray-300 text-sm">Positive (1)</span>
  </div>

  {/* Current Sentiment Display */}
  <p className="text-lg text-gray-300 mt-2 text-center">
    Sentiment: {sentiment.toFixed(2)}
  </p>
        </div>
        

         {/* Tempo Slider */}
<div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md w-full">
  <h2 className="text-xl font-semibold">Set Tempo</h2>
  
  <div className="flex items-center justify-between mt-2">
    {/* Negative Sentiment Label */}
    <span className="text-gray-300 text-sm">60 BPM</span>
    
    {/* Sentiment Slider */}
    <input
      type="range"
      min="60"
      max="160"
      step="1"
      value={tempo}
      onChange={(e) => setTempo(parseFloat(e.target.value))}
      className="w-full mx-4 accent-red-500"
    />
    
    {/* Positive Sentiment Label */}
    <span className="text-gray-300 text-sm">160 BPM</span>
  </div>

  {/* Current Sentiment Display */}
  <p className="text-lg text-gray-300 mt-2 text-center">
    Tempo: {tempo.toFixed(2)}
  </p>
        </div>
        

         {/* Energy Slider */}
<div className="bg-gray-800 p-6 mt-4 rounded-lg shadow-md w-full">
  <h2 className="text-xl font-semibold">Set Energy</h2>
  
  <div className="flex items-center justify-between mt-2">
    {/* Negative Sentiment Label */}
    <span className="text-gray-300 text-sm">0.0</span>
    
    {/* Sentiment Slider */}
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={energy}
      onChange={(e) => setEnergy(parseFloat(e.target.value))}
      className="w-full mx-4 accent-red-500"
    />
    
    {/* Positive Sentiment Label */}
    <span className="text-gray-300 text-sm">1.0</span>
  </div>

  {/* Current Sentiment Display */}
  <p className="text-lg text-gray-300 mt-2 text-center">
    Energy: {energy.toFixed(2)}
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
            100% { transform: translateX(-50px); } 
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
