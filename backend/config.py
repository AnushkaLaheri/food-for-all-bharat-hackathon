# config.py

MYSQL_HOST = '127.0.0.1'
MYSQL_USER = 'garim'
MYSQL_PASSWORD = 'Shashi@1415'
MYSQL_DB = 'foodbank_ai'

# Critical: encode @ as %40 in the password
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://garim:Shashi%401415@127.0.0.1/foodbank_ai'
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = '997ff799b7b12a214152893fb647aaf9024551095b7856f'
