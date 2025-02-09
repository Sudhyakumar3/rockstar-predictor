"use client";

import { useState } from "react";
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

      {/* Wavy Background */}
      <div className="absolute top-0 w-full h-[100vh] overflow-hidden">
        <WavyBackground />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mt-16 text-center">
        <h1 className="text-5xl font-bold">About Rockstar Predictor</h1>
        <p className="text-lg text-gray-300 mt-4">
          Discover how our AI-powered tool predicts a song’s popularity based on lyrics, themes, and tempo.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="relative z-10 w-full max-w-3xl mt-8 space-y-4">
        {/* Section 1: How Does It Work? */}
        <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-md">
          <button
            className="w-full text-left px-6 py-4 font-semibold text-lg"
            onClick={() => toggleSection("how-it-works")}
          >
            How Does It Work?
          </button>
          {openSection === "how-it-works" && (
            <div className="px-6 pb-4 text-gray-300">
              Ever wondered what makes a song a <b>chart-topping hit</b>? Rockstar Predictor analyzes your lyrics to
              predict their popularity, key themes, and optimal tempo based on patterns found in successful songs.
              Whether you're a songwriter, musician, or just curious, our tool helps you explore the science behind
              hit songs and how themes and lyrics influence success.
            </div>
          )}
        </div>

        {/* Section 2: How Do We Analyze Your Lyrics? */}
        <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-md">
          <button
            className="w-full text-left px-6 py-4 font-semibold text-lg"
            onClick={() => toggleSection("analyze-lyrics")}
          >
            How Do We Analyze Your Lyrics?
          </button>
          {openSection === "analyze-lyrics" && (
            <div className="px-6 pb-4 text-gray-300">
              When you input lyrics, our system:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li><b>Extracts Keywords</b> – Identifies relevant words and phrases that define the song’s message.</li>
                <li><b>Matches Themes</b> – Detects overarching themes (e.g., love, heartbreak, rebellion, nostalgia) found in popular songs.</li>
                <li><b>Performs Sentiment Analysis</b> – Determines whether the lyrics express a positive, negative, or neutral emotional tone.</li>
                <li><b>Suggests an Optimal Tempo</b> – Recommends a BPM (beats per minute) range based on themes found in similar hit songs.</li>
                <li><b>Compares to Popular Songs</b> – Looks at historical hit data to gauge how well the song aligns with trends.</li>
              </ul>
              This information is combined into a popularity score and insightful recommendations to help you refine your lyrics.
            </div>
          )}
        </div>

        {/* Section 3: How Is the Popularity Score Determined? */}
        <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-md">
          <button
            className="w-full text-left px-6 py-4 font-semibold text-lg"
            onClick={() => toggleSection("popularity-score")}
          >
            How Is the Popularity Score Determined?
          </button>
          {openSection === "popularity-score" && (
            <div className="px-6 pb-4 text-gray-300">
              Your song receives a popularity score (out of 100) based on a combination of factors:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li><b>Strong, recognizable themes</b> – Songs with clear, relatable themes tend to perform better.</li>
                <li><b>Emotional impact</b> – Lyrics that evoke strong emotions are more memorable and engaging.</li>
                <li><b>Keyword strength</b> – Certain words resonate deeply with audiences and contribute to hit-making patterns.</li>
                <li><b>Structural similarity to successful songs</b> – If your song shares characteristics with historically popular hits, it may have a higher chance of success.</li>
                <li><b>Suggested Tempo Fit</b> – If your song’s themes align with a genre or hit-making trend, we suggest a tempo range (BPM) that works well for those themes.</li>
              </ul>
              While lyrics alone don’t guarantee a hit, Rockstar Predictor provides data-driven insights that can help songwriters refine their lyrics, select strong themes, and determine an ideal tempo.
            </div>
          )}
        </div>

        {/* Section 4: Why Are Themes Important? */}
        <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-md">
          <button
            className="w-full text-left px-6 py-4 font-semibold text-lg"
            onClick={() => toggleSection("themes-importance")}
          >
            Why Are Themes Important?
          </button>
          {openSection === "themes-importance" && (
            <div className="px-6 pb-4 text-gray-300">
              Every song tells a story, and themes define what that story is about. We analyzed thousands of successful songs to identify common themes in popular music. Some of the most influential themes include:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li><b>Love & Relationships</b> – Romance, heartbreak, longing, and devotion dominate the charts.</li>
                <li><b>Motivation & Empowerment</b> – Songs about success, resilience, and confidence inspire audiences.</li>
                <li><b>Emotions & Struggles</b> – Themes like sadness, nostalgia, regret, anger, and grief add depth to songwriting.</li>
                <li><b>Partying & Celebration</b> – High-energy songs about fun, excess, and letting go remain fan favorites.</li>
              </ul>
              Our system identifies dominant themes in your lyrics and compares them to hit songs across multiple genres to give insights into your song's potential.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;