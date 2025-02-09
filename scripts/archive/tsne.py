from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import numpy as np

# Step 1: Connect to MongoDB and fetch all songs with their themes
MONGO_URI = ""
client = MongoClient(MONGO_URI)  # Replace with your connection string
db = client["songs_analysis"]
collection = db["songs"]

# Fetch songs that have themes
songs = list(collection.find({"themes": {"$exists": True, "$ne": []}}, {"title": 1, "artist": 1, "themes": 1}))
print(f"Total songs with themes: {len(songs)}")

# Step 2: Prepare a list of theme strings for each song (concatenate themes)
song_themes = [" ".join(song["themes"]) for song in songs]

# Step 3: Generate embeddings for each song based on its combined themes
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(song_themes)

# Step 4: Cluster songs using K-Means
num_clusters = 5  # Adjust the number of clusters as needed
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
cluster_labels = kmeans.fit_predict(embeddings)

# Step 5: Reduce dimensions with t-SNE for visualization
tsne = TSNE(n_components=2, random_state=42, perplexity=10, max_iter=300)
X_embedded = tsne.fit_transform(embeddings)

# Step 6: Plot the t-SNE results with color-coded clusters
plt.figure(figsize=(14, 10))
scatter = plt.scatter(X_embedded[:, 0], X_embedded[:, 1], c=cluster_labels, cmap='tab10', alpha=0.8)
plt.colorbar(label='Cluster')
plt.title('t-SNE Visualization of Songs by Themes')
plt.xlabel('t-SNE Dimension 1')
plt.ylabel('t-SNE Dimension 2')

# Annotate a few songs for clarity
for i, song in enumerate(songs[:20]):  # Annotate the first 20 songs for readability
    plt.annotate(f"{song['title']} - {song['artist']}", (X_embedded[i, 0], X_embedded[i, 1]), fontsize=9, alpha=0.7)

plt.show()


