import os
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
FLAG = "flag{1t'5_alm057_t0_e45y}"
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'instance', 'ctf.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
def init_db():
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password='supersecretpassword123')
            db.session.add(admin)
            db.session.commit()
init_db()
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        user = User.query.filter_by(username=username, password=password).first()
        if user and user.username == 'admin':
            return render_template("admin.html", content=FLAG)
        return render_template("index.html")
    return render_template("index.html")
if __name__ == '__main__':
    app.run(debug=True, port=5004, host='0.0.0.0')
