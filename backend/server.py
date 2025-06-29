import os
from app import create_app
from flask import Flask
from flask_cors import CORS  # ✅ THIS IS MISSING

app = create_app()

CORS(app, origins=["https://food-for-all-bharat-hackathon.vercel.app"])
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True)

