from flask import Flask, request, jsonify, send_file
from flask_cors import CORS



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response



@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"})



if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)






