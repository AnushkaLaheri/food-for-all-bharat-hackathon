import os

# Load MySQL configuration from environment variables (ideal for Render & Railway)
MYSQL_USER = os.environ.get("MYSQL_USER", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "MpwBJARwgaKHKIJRuicYYBiEMewfMMDr")
MYSQL_HOST = os.environ.get("MYSQL_HOST", "mysql.railway.internal")
MYSQL_PORT = os.environ.get("MYSQL_PORT", "3306")
MYSQL_DB = os.environ.get("MYSQL_DB", "railway")

SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = os.environ.get(
    "SECRET_KEY", "997ff799b7b12a214152893fb647aaf9024551095b7856f"
)
