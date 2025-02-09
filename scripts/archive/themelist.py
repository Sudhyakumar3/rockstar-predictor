from pymongo import MongoClient
import csv

# Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)  # Replace with your connection string
db = client["songs_analysis"]
collection = db["songs"]

# Aggregate all unique themes and count their occurrences
pipeline = [
    {"$unwind": "$themes"},  # Unwind the themes array
    {"$group": {"_id": "$themes", "count": {"$sum": 1}}},  # Group by theme and count
    {"$sort": {"count": -1}}  # Sort by count in descending order
]

# Execute the aggregation
themes_with_count = list(collection.aggregate(pipeline))

# Print each theme with its count
for theme in themes_with_count:
    print(f"Theme: {theme['_id']}, Count: {theme['count']}")

