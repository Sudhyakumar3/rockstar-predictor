import pymongo
from datetime import datetime

# MongoDB connection
MONGO_URI = "mongodb+srv://new_user_31:#4djtKixtxvqXLK@songs.hs9s4.mongodb.net/?retryWrites=true&w=majority&appName=songs"
client = pymongo.MongoClient(MONGO_URI)
db = client.songs_analysis
songs_collection = db.songs

# Function to fetch songs for a given month and year and return top 5 by popularity
def get_top_songs_by_month_year(month, year):
    # Create the target date format 'YYYY-MM-01'
    target_date = f"{year}-{month:02d}-01"
    
    # Query to find all songs where the 'dates' array contains the target_date
    query = {"dates": target_date}
    songs = songs_collection.find(query)
    
    # Sort songs by popularity in descending order and take top 5
    sorted_songs = sorted(songs, key=lambda x: x.get('popularity', 0), reverse=True)[:5]
    
    return sorted_songs

# Example usage
if __name__ == "__main__":
    month = 4  # February
    year = 2025  # 2025
    top_songs = get_top_songs_by_month_year(month, year)
    
    # Print out the top 5 songs
    for song in top_songs:
        print(f"Title: {song['title']}, Artist: {song['artist']}, Popularity: {song['popularity']}")
