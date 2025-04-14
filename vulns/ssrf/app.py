from flask import Flask, request
import requests

app = Flask(__name__)

FLAG = "CTF{SSRF_to_localhost}"  # Flag is hosted on an internal service

@app.route('/')
def index():
    url = request.args.get('url', 'http://example.com')
    try:
        response = requests.get(url, timeout=3)
        return f"Preview of {url}:<br><pre>{response.text[:500]}</pre>"
    except:
        return "Failed to fetch URL.", 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)