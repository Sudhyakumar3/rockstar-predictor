from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    lyrics = data.get("lyrics", "")

    if not lyrics:
        return jsonify({"error": "No lyrics provided"}), 400

    # Mock analysis results (replace with actual ML model later)
    response = {
        "popularity_score": 78,  # Mock popularity score
        "top_keywords": ["Love", "Dream", "Freedom"],
        "sentiment_score": 0.65,  # -1 (negative) to +1 (positive)
        "similar_songs": [
            {"name": "Shape of You", "artist": "Ed Sheeran", "sentiment": 0.8, "themes": ["Love", "Dance", "Romance"]},
            {"name": "Blinding Lights", "artist": "The Weeknd", "sentiment": 0.7, "themes": ["Nostalgia", "Love", "Energy"]},
            {"name": "Someone Like You", "artist": "Adele", "sentiment": -0.2, "themes": ["Heartbreak", "Hope", "Love"]}
        ],
        "recommendations": [
            "Consider adding more emotional words to target deeper connection.",
            "Your themes are strong, but adding a nostalgic element might boost engagement.",
            "A faster tempo might improve energy and make it more danceable."
        ]
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
