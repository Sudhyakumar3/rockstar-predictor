"use client";

import { useState } from "react";
import { WavyBackground } from "../components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

export default function Home() {
  const [lyrics, setLyrics] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Mock data for results (replace with API response)
  const predictedScore = 78;
  const topKeywords = ["Love", "Dream", "Freedom"];
  const sentimentScore = 0.65; // Ranges from -1 (negative) to +1 (positive)
  const similarSongs = [
    {
      image: "/song1.jpg",
      name: "Shape of You",
      artist: "Ed Sheeran",
      themes: ["Love", "Dance", "Romance"],
      sentiment: 0.8,
    },
    {
      image: "/song2.jpg",
      name: "Blinding Lights",
      artist: "The Weeknd",
      themes: ["Nostalgia", "Love", "Energy"],
      sentiment: 0.7,
    },
    {
      image: "/song3.jpg",
      name: "Someone Like You",
      artist: "Adele",
      themes: ["Heartbreak", "Hope", "Love"],
      sentiment: -0.2,
    },
  ];
  const recommendations = [
    "Consider adding more emotional words to target deeper connection.",
    "Your themes are strong, but adding a nostalgic element might boost engagement.",
    "A faster tempo might improve energy and make it more danceable.",
  ];

  const handleSubmit = () => {
    console.log("User lyrics:", lyrics);
    setShowResults(true); // Show the results popup
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white px-4">
      <Navbar />

      <WavyBackground />

      {/* Lyrics Input Box at the Top */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 mt-20">
        <h1 className="text-6xl font-bold tracking-wide">Rockstar Predictor 🎸</h1>
        <p className="text-xl text-gray-300 mt-4">Paste your lyrics and predict their popularity!</p>

        <div className="mt-8 w-full max-w-2xl">
          <textarea
            className="w-full h-40 p-4 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your lyrics here..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Analyze Lyrics
        </button>
      </div>

      {/* Results Popup */}
      {showResults && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="bg-gray-800 text-white p-8 rounded-lg max-w-3xl w-full shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Analysis Results</h2>

            {/* Display User Lyrics */}
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold mb-2">Your Lyrics</h3>
              <p className="text-gray-300">{lyrics || "No lyrics provided."}</p>
            </div>

            {/* Popularity Score */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Predicted Popularity</h3>
              <p className="text-2xl font-bold text-blue-400">{predictedScore}/100</p>
            </div>

            {/* Top Keywords */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Top Keywords</h3>
              <p className="text-gray-300">{topKeywords.join(", ")}</p>
            </div>

            {/* Sentiment Analysis Slider */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Sentiment Analysis</h3>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={sentimentScore}
                readOnly
                className="w-full mt-2 accent-blue-500"
              />
              <div className="flex justify-between text-sm mt-1">
                <span className="text-red-500">Negative</span>
                <span className="text-gray-300">Neutral</span>
                <span className="text-green-500">Positive</span>
              </div>
            </div>

            {/* Similar Songs */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Similar Songs</h3>
              <div className="grid grid-cols-3 gap-4">
                {similarSongs.map((song, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-lg text-center">
                    <img src={song.image} alt={song.name} className="w-full h-32 object-cover rounded-md mb-2" />
                    <h4 className="text-lg font-bold">{song.name}</h4>
                    <p className="text-gray-400">{song.artist}</p>
                    <p className="text-gray-300 text-sm mt-1">Themes: {song.themes.join(", ")}</p>
                    <p className="text-sm mt-1">
                      Sentiment:{" "}
                      <span className={song.sentiment > 0 ? "text-green-400" : "text-red-400"}>
                        {song.sentiment > 0 ? "Positive" : "Negative"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc list-inside text-gray-300">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowResults(false)}
              className="mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
