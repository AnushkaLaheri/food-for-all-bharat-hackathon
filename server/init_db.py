import os
import mysql.connector
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database configuration
db_config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DB', 'foodbank_ai')
}

# SQL statements to create tables if they don't exist
tables = {
    'users': '''
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('donor','consumer','ngo','admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        address TEXT NOT NULL,
        profile_picture VARCHAR(255)
    );
    ''',
    'fooddonations': '''
    CREATE TABLE IF NOT EXISTS fooddonations (
        donation_id INT AUTO_INCREMENT PRIMARY KEY,
        food_item VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        expiry_date DATE NOT NULL,
        description TEXT,
        status ENUM('available','reserved','claimed') DEFAULT 'available',
        donor_id INT NOT NULL,
        donation_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_id) REFERENCES users(user_id)
    );
    ''',
    'feedback': '''
    CREATE TABLE IF NOT EXISTS feedback (
        feedback_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        feedback_text TEXT NOT NULL,
        rating INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
    ''',
    'referrals': '''
    CREATE TABLE IF NOT EXISTS referrals (
        referral_id INT AUTO_INCREMENT PRIMARY KEY,
        referrer_id INT NOT NULL,
        referred_email VARCHAR(255) NOT NULL,
        referred_name VARCHAR(255),
        message TEXT,
        status ENUM('pending','registered','declined') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (referrer_id) REFERENCES users(user_id)
    );
    ''',
    'requests': '''
    CREATE TABLE IF NOT EXISTS requests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        donation_id INT NOT NULL,
        requester_id INT NOT NULL,
        quantity_requested INT NOT NULL,
        purpose TEXT,
        status ENUM('pending','approved','rejected','completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (donation_id) REFERENCES fooddonations(donation_id),
        FOREIGN KEY (requester_id) REFERENCES users(user_id)
    );
    '''
}

def init_database():
    """Initialize the database with required tables"""
    try:
        # Connect to MySQL server
        conn = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password']
        )
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
        cursor.execute(f"USE {db_config['database']}")
        
        # Create tables
        for table_name, table_sql in tables.items():
            logger.info(f"Creating table {table_name} if it doesn't exist...")
            cursor.execute(table_sql)
            logger.info(f"Table {table_name} is ready.")
        
        # Create admin user if it doesn't exist
        cursor.execute("SELECT * FROM users WHERE email = 'admin@foodforall.com'")
        admin = cursor.fetchone()
        
        if not admin:
            from utils import hash_password
            hashed_password = hash_password('admin123')
            
            cursor.execute(
                """INSERT INTO users (email, role, password, full_name, phone_number, address) 
                   VALUES ('admin@foodforall.com', 'donor', %s, 'Admin User', '1234567890', 'Admin Office')""",
                (hashed_password,)
            )
            conn.commit()
            logger.info("Admin user created.")
        
        logger.info("Database initialization completed successfully.")
        
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    init_database()