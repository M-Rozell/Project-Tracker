backend>
Windows (CMD):
python -m venv venv
venv\Scripts\activate
uvicorn app:app --reload
pip freeze > requirements.txt

**print() will bring up printer in Electron
**check correct address
git remote -v




@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response