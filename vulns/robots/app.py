from flask import Flask, send_from_directory, render_template, request, redirect, url_for
app = Flask(__name__)
SECRET_FLAG = "flag{rob0ts_txt_l34ks_4r3_d4ng3r0us}"
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')
@app.route('/s3cr3t_adm1n_p4n3l')
def admin_panel():
    return render_template("admin.html", content=SECRET_FLAG)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)