from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    cores = [
        {'nome': 'Verde', 'valor': '#1D9E75'},
        {'nome': 'Roxo', 'valor': '#7F77DD'},
        {'nome': 'Rosa', 'valor': '#D4537E'},
        {'nome': 'Azul', 'valor': '#378ADD'},
        {'nome': 'Amarelo', 'valor': "#FDFF83"},
    ]
    return render_template ('Criacao_Projeto.html', cores=cores)
if __name__ == '__main__':
    app.run(debug=True)