from flask import Flask, request, abort
import os

app = Flask(__name__)

@app.route('/')
def index():
    file = request.args.get('file', 'welcome.txt')

    # Prevent obvious directory traversal (but weak)
    if '../' in file:
        file = file.replace('../', '')
        # abort(403)  # Uncomment if you want to block instead of sanitize

    try:
        with open(f'./files/{file}', 'r') as f:
            content = f.read()
        return f"File: {file}<br><pre>{content}</pre>"
    except FileNotFoundError:
        return "File not found!", 404
    except Exception:
        return "An error occurred!", 500

if __name__ == '__main__':
    os.makedirs('./files', exist_ok=True)
    with open('./files/welcome.txt', 'w') as f:
        f.write("Hello! Try reading other files or you can try reading flag.txt")
    app.run(host='0.0.0.0', port=5000)
