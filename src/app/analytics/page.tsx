"use client";

import { useState } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
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
      const response = await fetch(`http://127.0.0.1:5000/analytics/top-songs?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      console.log("Fetched Data:", data); // Debugging Log
      setTopSongs(data.top_songs || []);
    } catch (error) {
      console.error("Error fetching top songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="absolute inset-0 z-0">
        <WavyBackground />
      </div>

      <div className="relative z-10 w-full max-w-4xl mt-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Data Analysis</h1>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <label className="text-lg mb-2" htmlFor="month">Month</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="text-black p-2 rounded-lg"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-lg mb-2" htmlFor="year">Year</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="text-black p-2 rounded-lg"
            >
              <option value="">Select Year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Fetch Button */}
        <div className="text-center mb-8">
          <button
            onClick={fetchTopSongs}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Get Top 5 Songs
          </button>
        </div>
        
        <div className="bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Top 5 Most Popular</h2>

          {loading ? (
            <p className="text-gray-400">Loading top songs...</p>
          ) : topSongs.length === 0 ? (
            <p className="text-gray-400">No data available for the selected month and year.</p>
          ) : (
            <div className="space-y-4">
              {topSongs.map((song, index) => (
                <div key={index} className="flex items-center bg-gray-800 p-4 rounded-lg">
                  {/* Song info (title, artist, themes) - Left Aligned */}
                  <img
                    src={song.image_url || "/default-song.jpg"}
                    alt={song.title}
                    className="w-16 h-16 bg-gray-600 rounded-lg mr-4 object-cover"
                  />
                  <div className="flex-1">
                    <div>
                      <h3 className="text-lg font-bold">{song.title}</h3>
                      <p className="text-gray-400">
                        {song.artist} | Themes: {Array.isArray(song.themes) ? song.themes.join(", ") : "No themes available"}
                      </p>
                    </div>
                  </div>

                  {/* Sentiment Analysis Slider - Right Aligned */}
                  <div className="flex flex-col items-end ml-4 w-32">
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.01"
                      value={song.sentiment_score || 0}
                      readOnly
                      className="w-full mt-2 accent-blue-500"
                    />
                    <div className="flex justify-between text-sm mt-1 w-full">
                      <span className="text-red-400">Negative</span>
                      <span className="text-gray-300"> &nbsp;</span>
                      <span className="text-green-400">Positive</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
