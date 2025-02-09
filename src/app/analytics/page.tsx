"use client";

import { useState } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

export default function About() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mt-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Data Analysis</h1>
        
        {/* Filter Section */}
        <div className="flex justify-between items-center mb-8">
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
              {/* Add more months */}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-lg mb-2" htmlFor="year">Year</label>
            <input
              id="year"
              type="number"
              placeholder="Enter Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="text-black p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Scatter Plot Placeholder */}
        <div className="bg-gray-700 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Scatter Plot (Themes vs Popularity)</h2>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">[ Scatter Plot Placeholder ]</p>
          </div>
        </div>

        {/* Theme Key */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-2">Key for Other Themes</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Theme 1: Description</li>
            <li>Theme 2: Description</li>
            <li>Theme 3: Description</li>
          </ul>
        </div>

        {/* Top 5 Most Popular Section */}
        <div className="bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Top 5 Most Popular</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={index} className="flex items-center bg-gray-800 p-4 rounded-lg">
                <div className="w-16 h-16 bg-gray-600 rounded-lg mr-4"></div>
                <div>
                  <h3 className="text-lg font-bold">Song Name {item}</h3>
                  <p className="text-gray-400">Artist Name | Themes: Love, Dance, Party</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

