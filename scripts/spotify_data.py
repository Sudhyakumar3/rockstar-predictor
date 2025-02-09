import requests
import base64
from pymongo import MongoClient

CLIENT_ID = ""
CLIENT_SECRET = ""
MONGO_URI = ""

client = MongoClient(MONGO_URI)
db = client.songs_analysis
songs_collection = db.songs

# Encode credentials for Spotify API
credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
encoded_credentials = base64.b64encode(credentials.encode()).decode()

# Get OAuth Token from Spotify
auth_url = "https://accounts.spotify.com/api/token"
auth_response = requests.post(auth_url, 
    data={"grant_type": "client_credentials"}, 
    headers={"Authorization": f"Basic {encoded_credentials}", "Content-Type": "application/x-www-form-urlencoded"}
)

auth_data = auth_response.json()
access_token = auth_data.get("access_token")

if not access_token:
    print("Error obtaining access token:", auth_data)  # Debugging
    exit()

# Function to search for a track on Spotify and fetch popularity & image URL
def get_popularity_and_image(title, artist):
    search_url = "https://api.spotify.com/v1/search"
    params = {"q": f"{title} {artist}", "type": "track", "limit": 1}
    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(search_url, headers=headers, params=params)
    data = response.json()

    # Extract popularity and image URL
    if "tracks" in data and "items" in data["tracks"] and len(data["tracks"]["items"]) > 0:
        track = data["tracks"]["items"][0]
        popularity = track["popularity"]
        image_url = track["album"]["images"][0]["url"] if track["album"]["images"] else "No image available"
        return popularity, image_url
    else:
        return None, None

# Function to update MongoDB with popularity and image URL
def update_songs_with_popularity_and_image():
    songs = songs_collection.find({"popularity": {"$exists": False}})  # Filter songs that don't have popularity and image

    for song in songs:
        title = song["title"]
        artist = song["artist"]
        print(f"Fetching popularity and image for: {title} by {artist}")

        popularity, image_url = get_popularity_and_image(title, artist)
        if popularity is not None and image_url is not None:
            songs_collection.update_one(
                {"_id": song["_id"]},
                {"$set": {"popularity": popularity, "image_url": image_url}}
            )
            print(f"Updated popularity and image for: {title}")
        else:
            print(f"Track not found for: {title}")

if __name__ == "__main__":
    update_songs_with_popularity_and_image()
