from flask import Flask, render_template_string, request
from flask_sqlalchemy import SQLAlchemy
import sqlite3

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
            guest = User(username='guest', password='password123')
            db.session.add(admin)
            db.session.add(guest)
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
                response = f"<h1>Welcome, {user[1]}!</h1>"
                if user[1] == 'admin':
                    response += "<p>FLAG: flag{1t'5_alm057_t0_e45y}</p>"
                else:
                    response += "<p>Regular user access</p>"
                return response
            else:
                return "<p>Invalid credentials</p>"
        except Exception as e:
            conn.close()
            return f"<p>Error: {str(e)}</p>"
    
    return render_template_string('''
        <form method="POST">
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            <input type="submit" value="Login">
        </form>
    ''')

if __name__ == '__main__':
    app.run(debug=True)