from flask import Flask

app = Flask(__name__)

@app.route('/flag')
def flag():
    return "flag{n4h_man_h0w_did_I_mes5_up_th1s_64d}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)