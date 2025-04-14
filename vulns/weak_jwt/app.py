from flask import Flask, request, jsonify, make_response
import jwt
import datetime

app = Flask(__name__)

SECRET_KEY = "secret"  # <-- intentionally weak!

@app.route('/')
def home():
    return "    ."

@app.route('/login', methods=['GET'])
def login():
    token = jwt.encode({
        'user': 'guest',
        'role': 'user',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token})

@app.route('/admin', methods=['GET'])
def admin():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 403

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if data['role'] == 'admin':
            return jsonify({'message': 'Congrats! Here is your flag: flag{y0u_br0k3_7h3_jw7}'})
        else:
            return jsonify({'message': 'You must be admin to access this!'}), 403
    except Exception as e:
        return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # Correct for Docker
