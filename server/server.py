from flask import Flask, request, jsonify
from flask_pymysql import MySQL
from passlib.hash import sha256_crypt
from config import MYSQL_CONFIG, UPLOAD_FOLDER, PROFILE_PICTURES_FOLDER, DONATION_IMAGES_FOLDER

app = Flask(__name__)

# ✅ Correctly set all config at once
app.config.update(MYSQL_CONFIG)
app.config['pymysql_kwargs'] = {}

# Initialize MySQL
mysql = MySQL(app)

# Register route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Missing data'}), 400

    hashed_password = sha256_crypt.hash(password)

    try:
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, hashed_password)
        )
        mysql.connection.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        try:
            cur.close()
        except:
            pass  # avoids UnboundLocalError if cur was never created

if __name__ == '__main__':
    app.run(debug=True)
