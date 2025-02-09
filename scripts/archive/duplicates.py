from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)  # Replace with your connection string
db = client["songs_analysis"]
collection = db["songs"]

# Step 1: Group songs by title and artist
pipeline = [
    {
        "$group": {
            "_id": {"title": "$title", "artist": "$artist"},
            "latest_date": {"$max": "$date"},
            "ids_to_keep": {"$push": {"id": "$_id", "date": "$date", "weeks_on_chart": "$weeks_on_chart"}}
        }
    }
]

duplicates = list(collection.aggregate(pipeline))

# Step 2: Remove older versions, keeping only the one with the latest chart date
for duplicate in duplicates:
    ids_to_keep = sorted(duplicate["ids_to_keep"], key=lambda x: x["date"], reverse=True)
    entry_to_keep = ids_to_keep[0]
    ids_to_remove = ids_to_keep[1:]  # Keep only the first (most recent)

    if ids_to_remove:
        print(f"\n✅ Keeping: {duplicate['_id']['title']} by {duplicate['_id']['artist']}")
        print(f"- Chart Date: {entry_to_keep['date']}, Weeks on Chart: {entry_to_keep['weeks_on_chart']}\n")
        print("❌ Removing duplicates:")
        for entry in ids_to_remove:
            print(f"- Chart Date: {entry['date']}, Weeks on Chart: {entry['weeks_on_chart']}")

        # Remove the older versions
        collection.delete_many({"_id": {"$in": [entry["id"] for entry in ids_to_remove]}})
        print(f"Removed {len(ids_to_remove)} duplicate entries.")

print("\nDuplicate removal complete.")
