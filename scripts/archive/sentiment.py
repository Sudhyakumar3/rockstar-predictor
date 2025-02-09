from pymongo import MongoClient
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

# Ensure NLTK resources are available
nltk.download('vader_lexicon')

# Initialize SentimentIntensityAnalyzer
sia = SentimentIntensityAnalyzer()

# Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client["songs_analysis"]
collection = db["songs"]

def analyze_sentiment(lyrics):
    """Returns the compound sentiment score for given lyrics."""
    sentiment = sia.polarity_scores(lyrics)
    return sentiment['compound']

def update_song_sentiment():
    """Iterate through all songs in the collection and update each with a sentiment score."""
    songs = collection.find({"lyrics": {"$exists": True}, "sentiment_score": {"$exists": False}})

    for song in songs:
        lyrics = song.get("lyrics", "")
        sentiment_score = analyze_sentiment(lyrics)
        
        # Update the document with the sentiment score
        collection.update_one(
            {"_id": song["_id"]},
            {"$set": {"sentiment_score": sentiment_score}}
        )
        print(f"Updated song: {song.get('title', 'Unknown')} with sentiment_score: {sentiment_score:.2f}")

if __name__ == "__main__":
    update_song_sentiment()
    print("Sentiment analysis and update completed!")
