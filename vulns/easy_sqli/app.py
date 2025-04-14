from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import sqlite3
FLAG = "flag{1t'5_alm057_t0_e45y}"
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ctf.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

# Initialize database
def init_db():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password='supersecretpassword123')
            # guest = User(username='guest', password='password123')
            db.session.add(admin)
            # db.session.add(guest)
            db.session.commit()

init_db()

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        # Vulnerable raw SQL query
        conn = sqlite3.connect('instance/ctf.db')
        cursor = conn.cursor()
        
        query = f"SELECT * FROM user WHERE username = '{username}' AND password = '{password}'"
        try:
            cursor.execute(query)
            user = cursor.fetchone()
            conn.close()
            
            if user:
                # response = f"<h1>Welcome, {user[1]}!</h1>"
                if user[1] == 'admin':
                    return render_template("admin.html", content=FLAG)
            else:
                return render_template("index.html")
        except Exception as e:
            conn.close()
            return f"<p>Error: {str(e)}</p>"
    
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, port = 5004)