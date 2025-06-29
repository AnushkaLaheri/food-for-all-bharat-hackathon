#!/usr/bin/env python

"""
Run script for the Food For All backend server.

This script initializes the database if needed and starts the Flask server.

Usage:
    python run.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize database
print("Initializing database...")
from init_db import init_database
init_database()

# Start the Flask server
print("Starting Flask server...")
from server import app

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"Server running on http://localhost:{port}")
    print(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )