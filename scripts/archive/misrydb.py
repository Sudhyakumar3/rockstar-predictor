from pymongo import MongoClient

# Use your actual MongoDB Atlas connection string
MONGO_URI = ""

client = MongoClient(MONGO_URI)
db = client.song_analysis  # Database
songs_collection = db.songs  # Collection

# Test if connection works
try:
    print("Connected to MongoDB successfully!")
    print("Sample song:", songs_collection.find_one())  # Fetch one song to check if data exists
except Exception as e:
    print("Error:", e)