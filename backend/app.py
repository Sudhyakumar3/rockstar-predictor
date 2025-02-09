from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.sentiment import SentimentIntensityAnalyzer
from collections import Counter
from groq import Groq
import numpy as np
import nltk
import re
import os

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Download necessary NLTK data
nltk.download('vader_lexicon')
nltk.download('stopwords')
from nltk.corpus import stopwords

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Step 1: Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["songs_analysis"]
collection = db["songs"]

# Initialize SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Step 2: Extract Major Themes using Groq LLM
def extract_themes(lyrics):
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
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
    return themes

# Step 3: Sentiment Analysis
def analyze_sentiment(lyrics):
    sia = SentimentIntensityAnalyzer()
    sentiment = sia.polarity_scores(lyrics)
    return sentiment['compound']

def predict_popularity(themes, model, collection):
    theme_string = " ".join([theme.lower().strip() for theme in themes])  # Normalize
    theme_embedding = model.encode([theme_string])

    # Fetch songs with the correct field name "popularity"
    songs = list(collection.find({"themes": {"$exists": True, "$ne": []}}, {"themes": 1, "popularity": 1}))
    
    if not songs:
        return 50  # Fallback if no songs are found

    # Encode each song's themes
    song_embeddings = model.encode([" ".join(song["themes"]).lower() for song in songs])

    # Compute cosine similarities
    similarities = cosine_similarity(theme_embedding, song_embeddings)[0]
    top_indices = [i for i in similarities.argsort()[::-1] if similarities[i] > 0.1][:5]  # Only consider high similarity

    # Get corresponding popularity values
    popularity_scores = [songs[i].get("popularity", 0) for i in top_indices if songs[i].get("popularity", 0) > 0]
    
    return np.mean(popularity_scores) if popularity_scores else 50

# Step 5: Extract Top Keywords
def extract_top_keywords(lyrics):
    words = re.findall(r'\b\w+\b', lyrics.lower())
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in words if word not in stop_words and len(word) > 2]
    top_keywords = Counter(filtered_words).most_common(5)
    return [keyword for keyword, _ in top_keywords]

# Step 6: Find 3 Most Similar Songs
def find_similar_songs(themes, model, collection):
    theme_string = " ".join(themes)
    theme_embedding = model.encode([theme_string])
    
    # Fetch songs with the required fields, including image_url
    songs = list(collection.find({"themes": {"$exists": True, "$ne": []}}, {"title": 1, "artist": 1, "themes": 1, "image_url": 1}))
    song_embeddings = model.encode([" ".join(song["themes"]) for song in songs])
    
    # Compute cosine similarities
    similarities = cosine_similarity(theme_embedding, song_embeddings)[0]
    top_indices = similarities.argsort()[-3:][::-1]
    
    # Include image_url in the returned similar songs
    similar_songs = [
        {
            "title": songs[i]["title"],
            "artist": songs[i]["artist"],
            "themes": songs[i]["themes"],
            "image_url": songs[i].get("image_url", "/default-image.jpg")  # Fallback to a default image if image_url is missing
        }
        for i in top_indices
    ]
    return similar_songs

# Step 7: Provide Recommendations
def generate_recommendations(lyrics):
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a songwriting assistant. Provide constructive feedback and suggestions to improve the song. Return your suggestions as a list of 3-5 bullet points."
            },
            {"role": "user", "content": f"Here are the song lyrics:\n{lyrics}\nPlease suggest improvements."}
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.5,
        max_completion_tokens=300,
        top_p=1,
        stream=False
    )
    recommendations = chat_completion.choices[0].message.content.split('\n')
    return [rec.strip('- ') for rec in recommendations if rec.strip()]

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    lyrics = data.get("lyrics", "")
    
    if not lyrics:
        return jsonify({"error": "No lyrics provided"}), 400
    
    # Perform full analysis
    themes = extract_themes(lyrics)
    sentiment_score = analyze_sentiment(lyrics)
    popularity_score = predict_popularity(themes, model, collection)
    keywords = extract_top_keywords(lyrics)
    similar_songs = find_similar_songs(themes, model, collection)
    recommendations = generate_recommendations(lyrics)
    
    response = {
        "themes": themes,
        "sentiment_score": sentiment_score,
        "popularity_score": popularity_score,
        "top_keywords": keywords,
        "similar_songs": similar_songs,
        "recommendations": recommendations
    }

    return jsonify(response)

def serialize_song(song):
    """Convert MongoDB document to JSON-serializable format."""
    song['_id'] = str(song['_id'])  # Convert ObjectId to string
    return song

@app.route("/analytics/top-songs", methods=["GET"])
def get_top_songs_by_month_year():
    month = request.args.get("month")  # Extract month from query parameters
    year = request.args.get("year")  # Extract year from query parameters

    if not month or not year:
        return jsonify({"error": "Month and year are required as query parameters."}), 400

    try:
        month_num = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ].index(month) + 1  # Convert month name to number
        year = int(year)
    except ValueError:
        return jsonify({"error": "Invalid month or year"}), 400

    target_date = f"{year}-{month_num:02d}-01"
    print(target_date)
    query = {"dates": target_date}
    songs = list(collection.find(query))

    sorted_songs = sorted(songs, key=lambda x: x.get('popularity', 0), reverse=True)[:5]
    serialized_songs = [serialize_song(song) for song in sorted_songs]

    return jsonify({"top_songs": serialized_songs})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


