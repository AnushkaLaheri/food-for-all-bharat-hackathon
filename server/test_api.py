import requests
import json

# Base URL for the API
BASE_URL = 'http://localhost:5001/api'

# Test data
test_user = {
    'email': 'test@example.com',
    'password': 'password123',
    'role': 'donor',
    'full_name': 'Test User',
    'phone_number': '1234567890',
    'address': '123 Test St'
}

test_consumer = {
    'email': 'consumer@example.com',
    'password': 'password123',
    'role': 'consumer',
    'full_name': 'Consumer User',
    'phone_number': '9876543210',
    'address': '456 Consumer St'
}

test_donation = {
    'food_item': 'Rice',
    'quantity': 10,
    'expiry_date': '2023-12-31',
    'description': '10kg bag of rice'
}

test_request = {
    'quantity_requested': 5,
    'purpose': 'For community food drive'
}

test_feedback = {
    'feedback_text': 'Great service!',
    'rating': 5
}

test_referral = {
    'referred_email': 'friend@example.com',
    'referred_name': 'Friend Name',
    'message': 'Check out this platform!'
}

# Helper function to print response
def print_response(response):
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("---")

# Test health check
def test_health_check():
    print("\nTesting Health Check...")
    response = requests.get('http://localhost:5001/')
    print_response(response)

# Test user registration
def test_registration():
    print("\nTesting User Registration...")
    response = requests.post(f"{BASE_URL}/user/register", json=test_user)
    print_response(response)
    return response.json().get('data', {}).get('token')

# Test user login
def test_login():
    print("\nTesting User Login...")
    response = requests.post(f"{BASE_URL}/user/login", json={
        'email': test_user['email'],
        'password': test_user['password']
    })
    print_response(response)
    return response.json().get('data', {}).get('token')

# Test get profile
def test_get_profile(token, user_id):
    print("\nTesting Get Profile...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f"{BASE_URL}/user/profile/{user_id}", headers=headers)
    print_response(response)

# Test create donation
def test_create_donation(token):
    print("\nTesting Create Donation...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(f"{BASE_URL}/donations", json=test_donation, headers=headers)
    print_response(response)
    return response.json().get('data', {}).get('donation_id')

# Test get donations
def test_get_donations(token):
    print("\nTesting Get Donations...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f"{BASE_URL}/donations", headers=headers)
    print_response(response)

# Test get leaderboard
def test_get_leaderboard():
    print("\nTesting Get Leaderboard...")
    response = requests.get(f"{BASE_URL}/leaderboard")
    print_response(response)

# Test submit feedback
def test_submit_feedback(token):
    print("\nTesting Submit Feedback...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(f"{BASE_URL}/feedback", json=test_feedback, headers=headers)
    print_response(response)

# Test create referral
def test_create_referral(token):
    print("\nTesting Create Referral...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(f"{BASE_URL}/referrals", json=test_referral, headers=headers)
    print_response(response)

def test_create_request(token, donation_id):
    print("\nTesting Create Request...")
    # First register a consumer
    consumer_token = None
    try:
        # Try to register a consumer
        response = requests.post(f"{BASE_URL}/user/register", json=test_consumer)
        if response.status_code == 201:
            # Login as consumer
            login_response = requests.post(f"{BASE_URL}/user/login", json={
                "email": test_consumer["email"],
                "password": test_consumer["password"]
            })
            if login_response.status_code == 200:
                consumer_token = login_response.json().get("data", {}).get("token")
        else:
            # Try login if registration fails
            login_response = requests.post(f"{BASE_URL}/user/login", json={
                "email": test_consumer["email"],
                "password": test_consumer["password"]
            })
            if login_response.status_code == 200:
                consumer_token = login_response.json().get("data", {}).get("token")
    except Exception as e:
        print(f"Failed to get consumer token: {str(e)}")
    
    if consumer_token:
        # Create request as consumer
        headers = {'Authorization': f'Bearer {consumer_token}'}
        request_data = test_request.copy()
        request_data["donation_id"] = donation_id
        response = requests.post(f"{BASE_URL}/requests", json=request_data, headers=headers)
        print_response(response)
        
        if response.status_code == 201:
            request_id = response.json().get("data", {}).get("request", {}).get("request_id")
            return request_id
    return None

def test_list_pending_requests(token):
    print("\nTesting List Pending Requests...")
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f"{BASE_URL}/requests/pending", headers=headers)
    print_response(response)

def test_accept_request(token, request_id):
    print("\nTesting Accept Request...")
    if not request_id:
        print("No request ID available to test accept request")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(f"{BASE_URL}/requests/{request_id}/accept", headers=headers)
    print_response(response)

# Run tests
def run_tests():
    # Test health check
    test_health_check()
    
    # Test registration or login
    token = test_registration()
    if not token:
        token = test_login()
    
    if token:
        # Get user ID from token (this is a simplification, in reality you'd decode the JWT)
        user_id = 1  # Assuming the first user has ID 1
        
        # Test profile
        test_get_profile(token, user_id)
        
        # Test donations
        donation_id = test_create_donation(token)
        test_get_donations(token)
        
        # Test request flow
        if donation_id:
            request_id = test_create_request(token, donation_id)
            if request_id:
                test_list_pending_requests(token)
                test_accept_request(token, request_id)
        
        # Test leaderboard
        test_get_leaderboard()
        
        # Test feedback
        test_submit_feedback(token)
        
        # Test referrals
        test_create_referral(token)
    else:
        print("Failed to get authentication token. Cannot proceed with authenticated tests.")

if __name__ == '__main__':
    run_tests()