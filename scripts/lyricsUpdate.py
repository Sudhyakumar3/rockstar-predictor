import requests
from pymongo import MongoClient

MUSIX_API_KEY = ""

MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client.songs_analysis
songs_collection = db.songs

def get_track_id(title, artist):
    url = "https://api.musixmatch.com/ws/1.1/track.search"
    params = {
        "q_track": title,
        "q_artist": artist,
        "f_has_lyrics": 1,
        "s_track_rating": "desc",
        "apikey": MUSIX_API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    track_list = data.get("message", {}).get("body", {}).get("track_list", [])
    if track_list:
        return track_list[0]["track"]["track_id"]
    return None

def get_lyrics(track_id):
    url = "https://api.musixmatch.com/ws/1.1/track.lyrics.get"
    params = {
        "track_id": track_id,
        "apikey": MUSIX_API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    return data.get("message", {}).get("body", {}).get("lyrics", {}).get("lyrics_body", "Lyrics not found.")

# Function to update MongoDB with lyrics
def update_songs_with_lyrics():
    songs = songs_collection.find({"lyrics": {"$exists": False}})

    for song in songs:
        title = song["title"]
        artist = song["artist"]
        print(f"Fetching lyrics for: {title} by {artist}")

        track_id = get_track_id(title, artist)
        if track_id:
            lyrics = get_lyrics(track_id)

            songs_collection.update_one(
                {"_id": song["_id"]},
                {"$set": {"lyrics": lyrics}}
            )
            print(f"Updated lyrics for: {title}")
        else:
            print(f"Track ID not found for: {title}")

if __name__ == "__main__":
    update_songs_with_lyrics()