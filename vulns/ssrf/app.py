from flask import Flask, request, render_template
import requests
app = Flask(__name__)
@app.route('/')
def index():
    url = request.args.get('url', 'http://example.com')
    try:
        response = requests.get(url, timeout=3)
        return render_template("file.html", file=url, content=response.text)
    except:
        return "Failed to fetch URL.", 400
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)