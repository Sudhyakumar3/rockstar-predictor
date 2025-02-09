from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

# Step 1: Connect to MongoDB and fetch all songs with their themes
MONGO_URI = ""
client = MongoClient(MONGO_URI)
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
num_clusters = 10  # Use more clusters, we'll filter the top 5 later
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
cluster_labels = kmeans.fit_predict(embeddings)

# Step 5: Count the number of songs in each cluster
cluster_sizes = Counter(cluster_labels)

# Get the top 5 clusters with the most data points
top_clusters = [cluster for cluster, _ in cluster_sizes.most_common(5)]

# Create a cluster theme map for the top 5 clusters
cluster_theme_map = {}
for cluster in top_clusters:
    cluster_songs = [songs[i] for i in range(len(songs)) if cluster_labels[i] == cluster]
    all_themes = [theme for song in cluster_songs for theme in song["themes"]]
    common_themes = Counter(all_themes).most_common(3)  # Top 3 themes per cluster
    cluster_theme_map[cluster] = ", ".join([theme for theme, _ in common_themes])

# Step 6: Reduce dimensions with t-SNE for visualization
tsne = TSNE(n_components=2, random_state=42, perplexity=10, max_iter=300)
X_embedded = tsne.fit_transform(embeddings)

# Step 7: Plot the t-SNE results with color-coded clusters
plt.figure(figsize=(14, 10))
scatter = plt.scatter(X_embedded[:, 0], X_embedded[:, 1], c=cluster_labels, cmap='tab10', alpha=0.8)
plt.colorbar(label='Cluster')
plt.title('t-SNE Visualization of Songs by Themes')
plt.xlabel('t-SNE Dimension 1')
plt.ylabel('t-SNE Dimension 2')

# Create a legend for the top 5 clusters with their most common themes
legend_labels = [f"Cluster {cluster}: {cluster_theme_map[cluster]}" for cluster in top_clusters]
handles = [plt.Line2D([0], [0], marker='o', color=scatter.cmap(cluster / num_clusters), markersize=10, linestyle='') for cluster in top_clusters]
plt.legend(handles, legend_labels, title="Top 5 Theme Clusters", loc='upper right')

# Annotate a few songs for clarity
for i, song in enumerate(songs[:20]):  # Annotate the first 20 songs for readability
    plt.annotate(f"{song['title']} - {song['artist']}", (X_embedded[i, 0], X_embedded[i, 1]), fontsize=9, alpha=0.7)

plt.show()

