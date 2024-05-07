from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/api/ask', methods=['POST'])
def ask():
    data = request.json
    question = data.get('question', 'default question')
    try:
        # Fetch and parse the content from the URL
        response = requests.get('https://example.com/documentation')
        soup = BeautifulSoup(response.text, 'html.parser')

        # Example: Search for paragraphs that contain the question text
        results = soup.find_all('p', string=lambda text: question.lower() in text.lower())

        # Just a simple example to return the first match
        answer = results[0].text if results else "No answer found"
        response_data = {"response": answer}
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(response_data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
