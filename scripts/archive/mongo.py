from pymongo import MongoClient
from groq import Groq
import time

# Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)  # Replace with your connection string
db = client["songs_analysis"]  # Replace with your database name
collection = db["songs"]  # Replace with your collection name

# Initialize Groq client
groq_client = Groq(api_key='')

# Function to analyze lyrics and get the theme from Groq API
def get_song_theme(lyrics):
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Analyze the following song lyrics and provide the main theme in 1-3 words. The theme should be concise and fall into general categories such as love, party, heartbreak, sadness, motivation, or friendship. If multiple themes apply, list them in order of relevance. Just give me a list and don't give me any additional description, just the themes, in the format [theme 1, theme 2, theme 3], all lowercase."
                },
                {
                    "role": "user",
                    "content": lyrics
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=100,
            top_p=1,
            stop=None,
            stream=False,
        )

        # Properly access the 'choices' list from the response
        response_content = chat_completion.choices[0].message.content
        # Split the response into an array of themes
        return [theme.strip() for theme in response_content.split(",")]

    except Exception as e:
        print(f"Error processing lyrics: {e}")
        return ["error"]



for song in collection.find({"themes": {"$exists": False}}):
    lyrics = song.get("lyrics")
    if lyrics:
        themes = get_song_theme(lyrics)
        print(f"Song: {song.get('title', 'Unknown')} | Themes: {themes}")

        # Update the document with the detected themes (array)
        collection.update_one({"_id": song["_id"]}, {"$set": {"themes": themes}})
        
        # Sleep to avoid hitting rate limits
        time.sleep(3)
