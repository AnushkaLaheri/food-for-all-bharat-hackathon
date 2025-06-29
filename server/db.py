import os
import logging
from flask import g
from flask_mysqldb import MySQL
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mysql = MySQL()
_initialized = False

def init_app(app):
    global _initialized
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'foodbank_ai')
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    mysql.init_app(app)
    _initialized = True
    logger.info("✅ MySQL initialized")

def get_db():
    if not _initialized:
        raise Exception("MySQL not initialized. Did you call init_app?")
    if 'db' not in g:
        g.db = mysql.connection
        if g.db is None:
            logger.error("❌ mysql.connection is None!")
    return g.db

def get_cursor():
    if 'cursor' not in g:
        g.cursor = get_db().cursor()
    return g.cursor

def close_db(e=None):
    cursor = g.pop('cursor', None)
    if cursor:
        cursor.close()
    db = g.pop('db', None)
    if db:
        db.close()
        logger.info("✅ DB connection closed.")

def execute_query(query, params=None, commit=False):
    cursor = get_cursor()
    try:
        cursor.execute(query, params or ())
        if commit:
            get_db().commit()
        return cursor
    except Exception as e:
        logger.error(f"❌ Query failed: {e}")
        if commit:
            get_db().rollback()
        raise

def fetch_one(query, params=None):
    return execute_query(query, params).fetchone()

def fetch_all(query, params=None):
    return execute_query(query, params).fetchall()

def insert(query, params=None):
    return execute_query(query, params, commit=True).lastrowid

def update(query, params=None):
    return execute_query(query, params, commit=True).rowcount

def delete(query, params=None):
    return execute_query(query, params, commit=True).rowcount
