"use client";

import { useState } from "react";
import { WavyBackground } from "../components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function Home() {
  const [lyrics, setLyrics] = useState("");
  const [predictedScore, setPredictedScore] = useState(0);
  const [topKeywords, setTopKeywords] = useState<string[]>([]);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [similarSongs, setSimilarSongs] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false); // Controls expanding lyrics box

  const handleSubmit = async () => {
    if (!lyrics) {
      alert("Please enter some lyrics.");
      return;
    }

    setIsLoading(true);
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics }),
      });

      if (!response.ok) throw new Error("Failed to analyze lyrics.");

      const data = await response.json();
      console.log("Analysis results:", data);

      setPredictedScore(data.popularity_score);
      setTopKeywords(data.top_keywords);
      setSentimentScore(data.sentiment_score);
      setSimilarSongs(
        data.similar_songs.map((song: any, index: number) => ({
          ...song,
          image: `/song${index + 1}.jpg`,
        }))
      );
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while analyzing the lyrics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white px-4">
      <Navbar />
      <WavyBackground />

      {/* Typewriter Effect Heading */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 mt-20">
        <TypewriterEffectSmooth
          words={[
            { text: "Write", className: "text-white" },
            { text: "the", className: "text-white" },
            { text: "next", className: "text-white" },
            { text: "viral", className: "text-white" },
            { text: "song", className: "text-white" },
            { text: "with", className: "text-white" },
            { text: "Hit The Charts", className: "text-cyan-400" },
          ]}
          
        />
        <p className="text-xl text-white mt-4">Paste your lyrics and predict their popularity!</p>

        {/* Lyrics Input */}
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
  disabled={isLoading}
  type="button"
  className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
>
  {isLoading ? (
    <>
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="#1C64F2"
        />
      </svg>
      Loading...
    </>
  ) : (
    "Analyze Lyrics"
  )}
</button>

      </div>

      {/* Results Popup */}
        {showResults && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
            <div className="bg-gray-900 bg-opacity-80 text-white p-8 w-full max-w-5xl max-h-[80vh] shadow-lg overflow-y-auto relative results-popup border border-gray-600">
        

            
            {/* Close Button */}
            <button
              onClick={() => setShowResults(false)}
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-4 text-center">Analysis Results</h2>

            {/* Expandable User Lyrics Section */}
            <div className="bg-gray-700 rounded-lg mb-4 overflow-hidden transition-all">
              <button
                className="w-full text-left px-4 py-3 font-semibold text-lg bg-gray-600 hover:bg-gray-500 transition"
                onClick={() => setShowLyrics(!showLyrics)}
              >
                Your Lyrics {showLyrics ? "▼" : "▶"}
              </button>
              {showLyrics && (
                <div className="p-4 text-gray-300">
                  <p>{lyrics || "No lyrics provided."}</p>
                </div>
              )}
            </div>

            {/* Popularity Score & Top Keywords in One Line */}
            <div className="mb-3 flex justify-between items-center">
              {/* Popularity Score */}
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Predicted Popularity</h3>
                <p className="text-2xl font-bold text-blue-400">{predictedScore}/100</p>
              </div>

              {/* Top Keywords */}
              <div className="flex flex-col text-right">
                <h3 className="text-xl font-semibold">Top Keywords</h3>
                <p className="text-gray-300">{topKeywords.join(", ")}</p>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-center">Sentiment Analysis</h3>
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
<div className="mb-6 text-center">
  <h3 className="text-xl font-semibold mb-3">Similar Songs</h3>
  <div className="grid grid-cols-3 gap-4">
    {similarSongs.map((song, index) => (
      <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-lg text-center">
        <img
          src={song.image_url || "/default-image.jpg"}
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
<div className="text-center">
  <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
  {recommendations.length > 0 && (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg inline-block text-left max-w-3xl mx-auto">
      {/* Extract the first line only if it's not a recommendation */}
      <p className="text-gray-300 mb-3">
        {recommendations[0]?.includes("Here are some suggestions")
          ? recommendations[0]
          : "Here are some suggestions to improve the song:"}
      </p>
      <ul className="list-disc list-inside text-gray-300 space-y-3">
        {recommendations.slice(1).map((rec, index) => (
          <li key={index} className="leading-relaxed">
            {rec.replace(/^\*\s*/, "")} {/* Removes '*' at the start */}
          </li>
        ))}
      </ul>
    </div>
  )}
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