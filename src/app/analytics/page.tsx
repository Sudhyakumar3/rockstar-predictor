"use client";

import React, { useState } from "react";
import SongList from "../../components/ui/SongList";  // Adjust the path accordingly

const AnalyticsPage: React.FC = () => {
  const [songs, setSongs] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Fetch the top songs from the backend when month and year are selected
  const fetchTopSongs = async () => {
    if (month && year) {
      try {
        const response = await fetch(
          `http://localhost:5000/get_top_songs?month=${month}&year=${year}`
        );
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching top songs:", error);
      }
    }
  };

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      <div>
        <h2>Select a Month and Year</h2>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Month</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i} value={(i + 1).toString().padStart(2, "0")}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Year</option>
          {[2023, 2024, 2025].map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>

        <button onClick={fetchTopSongs}>Get Top Songs</button>
      </div>

      <SongList songs={songs} />
    </div>
  );
};

export default AnalyticsPage;
