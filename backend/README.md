# Food For All - Backend API

This is the backend API for the Food For All project, a platform that connects food donors with consumers and NGOs to reduce food waste and help those in need.

## Features

- User authentication (register, login)
- User profile management
- Food donation management
- Feedback submission and retrieval
- Leaderboard for top donors
- Referral system
- Image uploads for profile pictures and donations

## Tech Stack

- Flask: Python web framework
- MySQL: Database
- Flask-CORS: Cross-Origin Resource Sharing
- Flask-MySQLdb: MySQL integration
- bcrypt: Password hashing
- PyJWT: JSON Web Tokens for authentication
- Pillow: Image processing

## Prerequisites

- Python 3.8 or higher
- MySQL server
- The `foodbank_ai` database should already exist with the required tables

## Installation

1. Clone the repository or navigate to the project folder

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure the `.env` file with your database credentials and other settings:
   ```
   # Database Configuration
   MYSQL_HOST=localhost
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DB=foodbank_ai

   # Flask Configuration
   FLASK_APP=server.py
   FLASK_ENV=development
   FLASK_DEBUG=True
   SECRET_KEY=your_secret_key_here

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000

   # Upload Paths
   UPLOAD_FOLDER=uploads
   PROFILE_PICTURES_FOLDER=uploads/profile_pictures
   DONATION_IMAGES_FOLDER=uploads/donation_images
   ```

## Running the Server

Start the Flask server:

```bash
python -m server.server
```

The server will run on http://localhost:5001 by default.

## API Endpoints

### Authentication

- `POST /api/user/register`: Register a new user
- `POST /api/user/login`: Login and get authentication token

### User Management

- `GET /api/user/profile/<user_id>`: Get user profile
- `PUT /api/user/update/<user_id>`: Update user profile
- `POST /api/user/upload-profile-picture/<user_id>`: Upload profile picture
- `GET /api/user`: Get all users (admin only)

### Donations

- `POST /api/donations`: Create a new donation
- `GET /api/donations`: List all donations
- `GET /api/donations/<donation_id>`: Get a specific donation
- `PUT /api/donations/<donation_id>`: Update donation status

### Feedback

- `POST /api/feedback`: Submit feedback
- `GET /api/feedback`: Get all feedback (admin only)
- `GET /api/feedback/my-feedback`: Get current user's feedback

### Leaderboard

- `GET /api/leaderboard`: Get top donors by donation count
- `GET /api/leaderboard/monthly`: Get top donors for the current month

### Referrals

- `POST /api/referrals`: Create a new referral
- `GET /api/referrals`: Get current user's referrals
- `GET /api/referrals/all`: Get all referrals (admin only)

### Requests

- `POST /api/requests`: Create a new food request (consumer/NGO only)
- `GET /api/requests/pending`: List pending requests with optional filters (donor/NGO/admin only)
- `POST /api/requests/:requestId/accept`: Accept a request (donor only)
- `POST /api/requests/:requestId/reject`: Reject a request (donor only)
- `GET /api/requests/my-requests`: Get requests made by the current user

### Health Check

- `GET /`: Health check endpoint

## File Structure

```
server/
├── .env                    # Environment variables
├── server.py               # Main application entry point
├── db.py                   # Database connection and utilities
├── utils.py                # Utility functions
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── uploads/                # Uploaded files
│   ├── profile_pictures/   # User profile pictures
│   └── donation_images/    # Food donation images
└── routes/                 # API route modules
    ├── __init__.py         # Package initialization
    ├── user_routes.py      # User authentication and profile routes
    ├── donation_routes.py  # Food donation routes
    ├── feedback_routes.py  # Feedback routes
    ├── leaderboard_routes.py # Leaderboard routes
    └── referral_routes.py  # Referral routes
```

## Testing

You can test the API using tools like Postman or by connecting it to the frontend application running on http://localhost:3000.

## Error Handling

All API endpoints return structured JSON responses with appropriate HTTP status codes. Error responses include a message and error details.

## Security

- Passwords are hashed using bcrypt
- Authentication is handled with JWT tokens
- Role-based access control for protected endpoints