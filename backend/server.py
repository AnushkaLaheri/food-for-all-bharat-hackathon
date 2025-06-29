import os
from app import create_app
from flask_cors import CORS  # ✅ CORS imported

app = create_app()

# ✅ Recommended: Full CORS setup
CORS(app, origins=["https://food-for-all-bharat-hackathon.vercel.app"], supports_credentials=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True)
