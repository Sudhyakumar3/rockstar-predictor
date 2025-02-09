from groq import Groq
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.sentiment import SentimentIntensityAnalyzer
import numpy as np
import nltk

# Download necessary NLTK data for sentiment analysis
nltk.download('vader_lexicon')

# Step 1: Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client["songs_analysis"]
collection = db["songs"]

# Step 2: Extract Major Themes using Groq LLM
def extract_themes(lyrics):
    groq_client = Groq(api_key='')
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Analyze the following song lyrics and provide the main theme in 1-3 words. The theme should be concise and fall into general categories such as love, party, heartbreak, sadness, motivation, or friendship. If multiple themes apply, list them in order of relevance. Just give me a list and don't give me any additional description, just the themes, in the format [theme 1, theme 2, theme 3], all lowercase."
            },
            {"role": "user", "content": lyrics}
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=1024,
        top_p=1,
        stream=False
    )
    themes = chat_completion.choices[0].message.content.strip("[]").replace("'", "").split(", ")
    print(f"Extracted Themes: {themes}")
    return themes

# Step 3: Sentiment Analysis
def analyze_sentiment(lyrics):
    sia = SentimentIntensityAnalyzer()
    sentiment = sia.polarity_scores(lyrics)
    return sentiment

# Step 4: Find Similar Songs
def find_similar_songs(themes, model, collection):
    theme_string = " ".join(themes)
    theme_embedding = model.encode([theme_string])
    
    songs = list(collection.find({"themes": {"$exists": True, "$ne": []}}, {"title": 1, "artist": 1, "themes": 1}))
    song_embeddings = model.encode([" ".join(song["themes"]) for song in songs])
    
    similarities = cosine_similarity(theme_embedding, song_embeddings)[0]
    top_indices = similarities.argsort()[-3:][::-1]
    
    similar_songs = [{"title": songs[i]["title"], "artist": songs[i]["artist"], "themes": songs[i]["themes"]} for i in top_indices]
    return similar_songs

# Step 5: Sentiment and Similar Song Analysis Integration
def analyze_lyrics(lyrics):
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Extract themes using Groq
    themes = extract_themes(lyrics)
    
    # Analyze sentiment
    sentiment = analyze_sentiment(lyrics)
    
    # Find similar songs
    similar_songs = find_similar_songs(themes, model, collection)
    
    # Print the results
    print("\n🎵 Song Analysis Results 🎵")
    print(f"Extracted Themes: {themes}")
    print(f"Sentiment Analysis: {sentiment}")
    print("\nTop 3 Similar Songs:")
    for song in similar_songs:
        print(f" - {song['title']} by {song['artist']} (Themes: {', '.join(song['themes'])})")

# Example Usage
user_lyrics = """
Tell 'em to shoot
I'm out the loop, I'm outta range
Oh-yeah, I stay out the way-ay-ay!
Got another side of me, I like to get it poppin'
But these people in my business got me out here choosin' violence
"""

# Analyze the user's lyrics
analyze_lyrics(user_lyrics)
