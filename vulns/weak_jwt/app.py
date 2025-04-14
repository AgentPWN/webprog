from flask import Flask, request, jsonify, make_response, render_template
import jwt
import datetime

app = Flask(__name__)
FLAG = "flag{y0u_br0k3_7h3_jw7}"

SECRET_KEY = "secret"  # <-- intentionally weak!

@app.route('/')
def home():
    token = jwt.encode({
        'user': 'guest',
        'role': 'user',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, SECRET_KEY, algorithm='HS256')

    resp = make_response(render_template("index.html"))
    resp.set_cookie('token', token, httponly=True, samesite='Lax')
    return resp


@app.route('/admin', methods=['GET'])
def admin():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 403

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if data['role'] == 'admin':
            return render_template("admin.html",content= FLAG)
        else:
            return jsonify({'message': 'You must be admin to access this!'}), 403
    except Exception as e:
        return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # Correct for Docker
