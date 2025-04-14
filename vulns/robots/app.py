from flask import Flask, send_from_directory, render_template, request, redirect, url_for

app = Flask(__name__)

# Secret flag (in a real CTF, this would be an environment variable)
SECRET_FLAG = "flag{rob0ts_txt_l34ks_4r3_d4ng3r0us}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/s3cr3t_adm1n_p4n3l')
def admin_panel():
    if request.remote_addr != '127.0.0.1':
        return redirect(url_for('index'))
    return f"Admin Panel - Here's your flag: {SECRET_FLAG}"

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)