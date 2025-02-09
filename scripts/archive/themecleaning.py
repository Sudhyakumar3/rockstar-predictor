from pymongo import MongoClient
import re

# Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client["songs_analysis"]
collection = db["songs"]

# Step 1: Iterate through documents where 'themes' is an array
for doc in collection.find({"themes": {"$type": "array"}}):
    themes = doc["themes"]

    # Clean each element in the 'themes' array
    clean_themes = [re.sub(r'[^\w\s-]', '', t.lower()).strip() for t in themes if isinstance(t, str)]

    # Remove duplicates, empty values, and themes that contain 'error'
    clean_themes = list(filter(lambda t: t and "error" not in t, set(clean_themes)))

    # Perform the update only if there are changes
    if themes != clean_themes:
        collection.update_one({"_id": doc["_id"]}, {"$set": {"themes": clean_themes}})
        print(f"Updated document with _id: {doc['_id']} | Cleaned themes: {clean_themes}")

print("Themes cleanup complete.")


