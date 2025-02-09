import dash
from dash import dcc, html
import plotly.graph_objects as go
import numpy as np
from collections import Counter, defaultdict
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE

# Define a fixed list of colors
FIXED_COLORS = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
]

# Step 1: Connect to MongoDB and fetch all songs with their themes
client = MongoClient(MONGO_URI)
db = client["songs_analysis"]
collection = db["songs"]

# Fetch songs that have themes
songs = list(collection.find({"themes": {"$exists": True, "$ne": []}}, {"title": 1, "artist": 1, "themes": 1}))
print(f"Total songs with themes: {len(songs)}")

# Prepare a list of theme strings for each song
song_themes = [" ".join(song["themes"]) for song in songs]

# Step 2: Generate embeddings for each song using BERT
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(song_themes)

# Step 3: Cluster songs using K-Means
num_clusters = min(10, len(FIXED_COLORS))  # Ensure we don't exceed the number of fixed colors
kmeans = KMeans(n_clusters=num_clusters, random_state=42)
cluster_labels = kmeans.fit_predict(embeddings)

# Step 4: Reduce dimensions with t-SNE for visualization
tsne = TSNE(n_components=2, random_state=42, perplexity=10, max_iter=300)
X_embedded = tsne.fit_transform(embeddings)

# Prepare data for plotting
plot_data = {
    "x": X_embedded[:, 0],
    "y": X_embedded[:, 1],
    "title": [song["title"] for song in songs],
    "artist": [song["artist"] for song in songs],
    "themes": [", ".join(song["themes"]) for song in songs],
    "cluster": cluster_labels
}

# Create a mapping of cluster labels to main themes (most common theme in each cluster)
cluster_themes = defaultdict(list)
for song, cluster in zip(songs, cluster_labels):
    cluster_themes[cluster].extend(song["themes"])

main_theme_for_cluster = {
    cluster: Counter(themes).most_common(1)[0][0]
    for cluster, themes in cluster_themes.items()
}

# Aggregate clusters with the same main theme.
aggregated_themes = defaultdict(list)
for cluster, theme in main_theme_for_cluster.items():
    aggregated_themes[theme].append(cluster)

# Create a color map for clusters using the fixed colors
cluster_color_map = {i: FIXED_COLORS[i] for i in range(num_clusters)}

# Define a function to create the figure manually using graph_objects.
# The data are grouped by aggregated (main) theme so that the built-in legend shows one entry per aggregated theme.
def create_figure_manual(selected_themes=None):
    fig = go.Figure()
    
    # If a list of themes is provided, show only those; otherwise, show all aggregated themes.
    if selected_themes and len(selected_themes) > 0:
        themes_to_plot = [theme for theme in aggregated_themes.keys() if theme in selected_themes]
    else:
        themes_to_plot = list(aggregated_themes.keys())
    
    # For each aggregated theme, add a trace for each cluster in that theme.
    # Only the first trace in each group shows a legend item.
    for theme in sorted(themes_to_plot):
        clusters_in_theme = sorted(aggregated_themes[theme])
        legend_name = f"{theme} (Clusters: {', '.join(map(str, clusters_in_theme))})"
        for i, cluster in enumerate(clusters_in_theme):
            mask = np.array(plot_data["cluster"]) == cluster
            x_vals = np.array(plot_data["x"])[mask]
            y_vals = np.array(plot_data["y"])[mask]
            titles = np.array(plot_data["title"])[mask]
            artists = np.array(plot_data["artist"])[mask]
            themes_list = np.array(plot_data["themes"])[mask]

            hover_texts = [
                f"Title: {t}<br>Artist: {a}<br>Themes: {tm}"
                for t, a, tm in zip(titles, artists, themes_list)
            ]
            
            trace = go.Scatter(
                x=x_vals,
                y=y_vals,
                mode='markers',
                marker=dict(color=cluster_color_map[cluster], size=10),
                text=hover_texts,
                hoverinfo="text",
                legendgroup=theme,
                showlegend=True if i == 0 else False,
                name=legend_name if i == 0 else None
            )
            fig.add_trace(trace)
    
    # Update the layout for dark mode with transparent background and no title.
    fig.update_layout(
        title="",
        width=1000,
        height=800,
        legend_title="Aggregated Themes",
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="white"),
        margin=dict(l=0, r=0, t=0, b=0)
    )
    return fig

# Create a Dash app
app = dash.Dash(__name__)

# Dash layout with dark mode styling and without extra title/background.
app.layout = html.Div([
    dcc.Graph(
        id="tsne-plot",
        figure=create_figure_manual()
    )
], style={"backgroundColor": "transparent", "color": "white", "padding": "0px"})

# Run the app
if __name__ == "__main__":
    app.run_server(debug=True)
