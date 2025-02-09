import dash
from dash import dcc, html
import plotly.graph_objs as go
from pymongo import MongoClient
import pandas as pd

# Connect to MongoDB
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client["songs_analysis"]
collection = db["songs"]

# Prepare data for the plot
data = {
    "weeks_on_chart": [],
    "peak_position": [],
    "num_themes": []
}

for doc in collection.find({"themes": {"$exists": True, "$type": "array"}, "weeks_on_chart": {"$exists": True}, "peak_position": {"$exists": True}}):
    data["weeks_on_chart"].append(doc["weeks_on_chart"])
    data["peak_position"].append(doc["peak_position"])
    data["num_themes"].append(len(doc["themes"]))

# Convert to Pandas DataFrame for easier manipulation
df = pd.DataFrame(data)

# Initialize the Dash app
app = dash.Dash(__name__)

# Layout of the app
app.layout = html.Div([
    html.H1("3D Scatter Plot of Song Data", style={"textAlign": "center"}),

    dcc.Graph(
        id="3d-scatter-plot",
        figure={
            "data": [
                go.Scatter3d(
                    x=df["weeks_on_chart"],
                    y=df["peak_position"],
                    z=df["num_themes"],
                    mode="markers",
                    marker=dict(
                        size=8,
                        color=df["weeks_on_chart"],  # Color based on weeks_on_chart
                        colorscale="Viridis",
                        opacity=0.8
                    )
                )
            ],
            "layout": go.Layout(
                title="3D Scatter Plot of Weeks on Chart vs. Peak Position vs. Number of Themes",
                scene=dict(
                    xaxis_title="Weeks on Chart",
                    yaxis_title="Peak Position (lower is better)",
                    zaxis_title="Number of Themes"
                )
            )
        }
    )
])

# Run the app
if __name__ == "__main__":
    app.run_server(debug=True)
