"use client";

import { useState, ChangeEvent, MouseEvent, FocusEvent } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Navbar } from "@/components/ui/Navbar";

const About = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-900 text-white px-4">
      <Navbar />
      <div className="max-w-4xl mt-16 text-center">
        <h1 className="text-5xl font-bold">About Rockstar Predictor 🎸</h1>
        <p className="text-lg text-gray-300 mt-4">
          Discover how our AI-powered tool predicts a song’s popularity based on lyrics, themes, and tempo.
        </p>
      </div>

      <div className="max-w-3xl mt-12 space-y-6">
        {/* How It Works */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => toggleSection("howItWorks")}>How Does It Work?</h2>
          {openSection === "howItWorks" && (
            <p className="text-gray-300 mt-2">
              Ever wondered what makes a song a chart-topping hit? Rockstar Predictor analyzes your lyrics to predict their popularity, key themes, and optimal tempo based on patterns found in successful songs. Whether you're a songwriter, musician, or just curious, our tool helps you explore the science behind hit songs and how themes and lyrics influence success.
            </p>
          )}
        </div>

        {/* How Lyrics Are Analyzed */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => toggleSection("analyzeLyrics")}>How Do We Analyze Your Lyrics?</h2>
          {openSection === "analyzeLyrics" && (
            <ul className="text-gray-300 mt-2 list-disc list-inside">
              <li><strong>Extracts Keywords:</strong> Identifies key phrases that define your song’s message.</li>
              <li><strong>Matches Themes:</strong> Detects overarching themes like love, heartbreak, rebellion, nostalgia.</li>
              <li><strong>Performs Sentiment Analysis:</strong> Determines if the lyrics express a positive, negative, or neutral tone.</li>
              <li><strong>Suggests an Optimal Tempo:</strong> Recommends a BPM range based on similar hit songs.</li>
              <li><strong>Compares to Popular Songs:</strong> Checks how your lyrics align with historical hit data.</li>
            </ul>
          )}
        </div>

        {/* Popularity Score */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => toggleSection("popularityScore")}>How Is the Popularity Score Determined?</h2>
          {openSection === "popularityScore" && (
            <p className="text-gray-300 mt-2">
              The score is based on themes, emotional impact, keyword strength, structural similarity to successful songs, and suggested tempo fit.
            </p>
          )}
        </div>

        {/* Importance of Themes */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => toggleSection("themes")}>Why Are Themes Important?</h2>
          {openSection === "themes" && (
            <p className="text-gray-300 mt-2">
              Themes define a song’s story. Popular themes include love & relationships, motivation, emotional struggles, and partying & celebration.
            </p>
          )}
        </div>

        {/* Keywords & Hit Songs */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => toggleSection("keywords")}>Why Keywords Matter in Hit Songs</h2>
          {openSection === "keywords" && (
            <p className="text-gray-300 mt-2">
              Keywords reinforce a song’s message and make lyrics catchy. Romantic songs often include words like "love," "forever," and "heart."
            </p>
          )}
        </div>

        {/* Playground Feature */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold cursor-pointer" onClick={() => toggleSection("playground")}>Explore the Playground</h2>
          {openSection === "playground" && (
            <p className="text-gray-300 mt-2">
              Use our interactive Playground to experiment with themes, keywords, and tempo settings to see how they influence a song’s popularity score.
            </p>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <a href="/playground" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Try the Playground
        </a>
      </div>
    </div>
  );
};

export default About;