from flask import Flask, request, render_template, abort
import os
app = Flask(__name__)
@app.route('/')
def index():
    file = request.args.get('file', 'welcome.txt')
    if '../' in file:
        file = file.replace('../', '')
    try:
        with open(f'./files/{file}', 'r') as f:
            content = f.read()
        return render_template("file.html", file=file, content=content)
    except FileNotFoundError:
        return "File not found!", 404
    except Exception:
        return "An error occurred!", 500
if __name__ == '__main__':
    os.makedirs('./files', exist_ok=True)
    with open('./files/welcome.txt', 'w') as f:
        f.write(
            ">>> SYSTEM BREACH INITIATED <<<\n"
            "Welcome, Operative.\n"
            "Your mission (should you choose to accept it):\n"
            "- Infiltrate the file system.\n"
            "- Locate the hidden secrets.\n"
            "- Profit.\n\n"
            "Hint: Not all files want to be found. Some hide very well...\n"
            "Maybe something called 'flag.txt' is worth peeking at? 🕵️‍♂️\n"
            "Good luck. Or don't. ¯\\_(ツ)_/¯\n"
            "There might be a convenient query parameter called file."
        )
    app.run(host='0.0.0.0', port=5005)
