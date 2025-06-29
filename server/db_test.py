from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash
import MySQLdb.cursors

app = Flask(__name__)

# ------------------------------
# MySQL Database Configuration
# ------------------------------
app.config['MYSQL_HOST'] = 'localhost'         # Host where your MySQL server is running
app.config['MYSQL_USER'] = 'garim'              # Your MySQL username
app.config['MYSQL_PASSWORD'] = 'Shashi@1415'      # Your MySQL password
app.config['MYSQL_DB'] = 'foodbank_ai'          # The database you're using

mysql = MySQL(app)

# ------------------------------
# Route to handle user registration
# ------------------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Extract name, email, and password from request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # ------------------------------
    # Validate input fields
    # ------------------------------
    if not name or not email or not password:
        return jsonify({'error': 'Missing name, email, or password'}), 400

    try:
        # ------------------------------
        # Hash the password for security
        # ------------------------------
        hashed_password = generate_password_hash(password)

        # ------------------------------
        # Create a database cursor
        # ------------------------------
        cur = mysql.connection.cursor()

        # ------------------------------
        # Insert user into database
        # ------------------------------
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hashed_password)
        )

        # Commit the changes
        mysql.connection.commit()

        # Close the cursor
        cur.close()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Something went wrong while registering'}), 500

# ------------------------------
# Run the Flask application
# ------------------------------
if __name__ == '__main__':
    app.run(debug=True)
