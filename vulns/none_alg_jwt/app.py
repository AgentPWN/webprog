from flask import Flask, request, jsonify, make_response, render_template
import jwt
import datetime
from functools import wraps

app = Flask(__name__)

# Configuration
SECRET_KEY = "sup3r_s3cr3t_k3y_!@#$"  # In real CTF, this would be unknown
FLAG = "flag{jwt_n0n3_4lg0_byp4ss_1s_d4ng3r0us}"

# Mock user database
users = {
    "regular_user": {"password": "password123", "role": "user"},
    "admin": {"password": "admin123_@*$U)@#)@*$(*$)_)(#@!CHIUXJ(@*JE))", "role": "admin"}
}
@app.route('/')
def home():
    return render_template("index.html")

def generate_token(username):
    """Generate JWT token for authenticated users"""
    user_data = users.get(username)
    if not user_data:
        return None
        
    payload = {
        "username": username,
        "role": user_data["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    # POST method: handle login
    username = request.form.get("username")
    password = request.form.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    
    if username not in users or users[username]["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = generate_token(username)
    if not token:
        return jsonify({"error": "User not found"}), 404
    
    response = make_response(jsonify({"message": "Logged in successfully"}))
    response.set_cookie("auth", token, httponly=True)
    return response

@app.route('/admin')
def admin():
    """Admin endpoint vulnerable to none algorithm attack"""
    token = request.cookies.get("auth")
    
    if not token:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        # Vulnerable verification - accepts 'none' algorithm
        decoded = jwt.decode(token, options={"verify_signature": False})
        
        # Additional check to make the vulnerability less obvious
        if decoded.get("role") != "admin":
            return jsonify({"error": "Forbidden: Admin access required"}), 403
            
        return render_template("admin.html",content= FLAG)
        
    except jwt.exceptions.DecodeError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)