from flask import request, jsonify
from pymongo import MongoClient

# MongoDB connection setup
MONGO_URI = "your-mongodb-uri"
client = MongoClient(MONGO_URI)
db = client.songs_analysis
songs_collection = db.songs

def get_top_songs_by_month_year(month, year):
    # Query and logic to fetch top songs
    target_date = f"{year}-{month:02d}-01"
    query = {"dates": target_date}
    songs = songs_collection.find(query)
    sorted_songs = sorted(songs, key=lambda x: x.get('popularity', 0), reverse=True)[:5]
    return sorted_songs

def get_top_songs():
    month = int(request.args.get('month'))
    year = int(request.args.get('year'))
    top_songs = get_top_songs_by_month_year(month, year)
    return jsonify(top_songs)
