"use client";

import { useState } from "react";
import { WavyBackground } from "../components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

export default function Home() {
  const [lyrics, setLyrics] = useState("");
  const [predictedScore, setPredictedScore] = useState(0);
  const [topKeywords, setTopKeywords] = useState<string[]>([]);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [similarSongs, setSimilarSongs] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!lyrics) {
      alert("Please enter some lyrics.");
      return;
    }

    setIsLoading(true); // Show loading state
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lyrics }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze lyrics.");
      }

      const data = await response.json();
      console.log("Analysis results:", data);

      // Update state with API response
      setPredictedScore(data.popularity_score);
      setTopKeywords(data.top_keywords);
      setSentimentScore(data.sentiment_score);
      setSimilarSongs(
        data.similar_songs.map((song: any, index: number) => ({
          ...song,
          image: `/song${index + 1}.jpg`, // Replace with actual image paths if available
        }))
      );
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while analyzing the lyrics. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading state
    }
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
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze Lyrics"}
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
                  <img
                  src={song.image_url || "/default-image.jpg"}  // Use the image_url from the backend, or a default if not available
                  alt={song.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h4 className="text-lg font-bold">{song.title}</h4>
                  <p className="text-gray-400">{song.artist}</p>
                  <p className="text-gray-300 text-sm mt-1">Themes: {song.themes.join(", ")}</p>
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
