"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import "./playground.css"; // Import styles

interface ThemePopularity {
    name: string;
    count: number;
}

const Playground: React.FC = () => {
    const [themeInput, setThemeInput] = useState<string>("");
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [filteredThemes, setFilteredThemes] = useState<string[]>([]);
    const [showPopularThemes, setShowPopularThemes] = useState<boolean>(false);
    const [keywords, setKeywords] = useState<string>("");
    const [tempo, setTempo] = useState<number>(120);
    const [popularityScore, setPopularityScore] = useState<number | null>(null);

    // Full theme list
    const allThemes: string[] = [
        "power", "disillusionment", "toxic relationship", "intimacy", "pride", "murder", "trauma", "darkness", 
        "family", "regret", "responsibility", "hedonism", "violence", "travel", "grief", "sex", "love", 
        "observation", "indulgence", "relationships", "confusion", "doubt", "hustle", "drama", "outcasts", 
        "whiskey", "holiday", "deception", "isolation", "empowerment", "trust", "pain", "goodness", "opposition", 
        "lifestyle", "celebration", "party", "self-empowerment", "vengeance", "mistrust", "carelessness", "excess", 
        "abandonment", "flirtation", "solidarity", "dislike", "confidence", "poverty", "christmas", "protection", 
        "manipulation", "obsession", "ambition", "guilt", "streetlife", "attraction", "resilience", "loathing", 
        "forever", "joy", "sadness", "hate", "denial", "loyalty", "respect", "desire", "movingon", "liberation", 
        "freedom", "vulnerability", "money", "anxiety", "loss", "summer", "popularity", "pleasure", "friendship", 
        "happiness", "criticism", "swagger", "commitment", "seduction", "diss", "romance", "schadenfreude", 
        "materialism", "affection", "drugs", "heartbreak", "uncertainty", "fear", "acceptance", "swag", "nostalgia", 
        "fame", "misogyny", "cheating", "drinking", "betrayal", "longing", "infidelity", "jealousy", "devotion", 
        "roots", "winter", "concern", "evil", "detachment", "mortality", "appreciation", "lies", "success", 
        "insecurity", "struggle", "selfblame", "mockery", "anger", "gang", "arrogance", "fun", "selflove", 
        "perseverance", "wealth", "paranoia", "frustration", "gratitude", "authenticity", "makeover", "desperation", 
        "motivation", "dance", "loneliness", "toughness", "apathy", "blame", "rebellion", "selfdiscovery", 
        "innocence", "spirituality", "independence", "youth", "danger", "addiction", "apology", "revenge", 
        "identity", "possession", "cheer", "sarcasm", "lust", "aggression", "toxic love", "forgiveness", 
        "disappointment", "crime", "toxicity"
    ];

    // Popular themes list
    const themePopularity: ThemePopularity[] = [
        { name: "love", count: 135 }, { name: "heartbreak", count: 102 }, { name: "sadness", count: 57 },
        { name: "party", count: 47 }, { name: "motivation", count: 39 }, { name: "wealth", count: 29 },
        { name: "christmas", count: 21 }, { name: "freedom", count: 18 }, { name: "confidence", count: 15 },
        { name: "empowerment", count: 15 }, { name: "friendship", count: 14 }, { name: "desire", count: 14 },
    ];

    // Show popular themes when input is clicked
    const handleInputFocus = () => {
        if (!themeInput) {
            setFilteredThemes(themePopularity.map(t => t.name)); // Show only theme names
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
                .slice(0, 5); // Show top 5 matches
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
        setThemeInput(""); // Clear input
        setFilteredThemes([]); // Hide suggestions
    };

    // Remove selected theme
    const removeTheme = (theme: string) => {
        setSelectedThemes(selectedThemes.filter(t => t !== theme));
    };

    // Handle form submission
    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const fakeScore = Math.floor(Math.random() * 100);
        setPopularityScore(fakeScore);
    };

    return (
        <div className="playground">
            <h1>Song Popularity Playground</h1>
            <p>Experiment with themes, keywords, and tempo to see if your song is a hit!</p>

            <div className="controls">
                <div className="themes">
                    <h2>Select Up to 3 Themes</h2>
                    <input
                        type="text"
                        value={themeInput}
                        onChange={handleThemeInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Type a theme..."
                        className="theme-input"
                    />
                    {filteredThemes.length > 0 && (
                        <ul className="theme-suggestions">
                            {filteredThemes.map((theme, index) => (
                                <li key={index} onClick={() => selectTheme(theme)}>
                                    {theme}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="selected-themes">
                        {selectedThemes.map((theme, index) => (
                            <span key={index} className="theme-tag">
                                {theme} <button onClick={() => removeTheme(theme)}>x</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="keywords">
                    <h2>Enter Keywords</h2>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Type some keywords..."
                    />
                </div>

                <div className="tempo">
                    <h2>Set Tempo</h2>
                    <input
                        type="range"
                        min="60"
                        max="160"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                    />
                    <p>{tempo} BPM</p>
                </div>

                <button className="predict-button" onClick={handleSubmit}>
                    Is It a Hit?
                </button>

                {popularityScore !== null && (
                    <div className="result">
                        <h2>Predicted Popularity Score: {popularityScore}/100</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Playground;